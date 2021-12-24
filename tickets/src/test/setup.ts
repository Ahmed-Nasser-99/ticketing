// we use this file in the package.json file in the jest segment

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
//MongoMemoryServer starts a copy of mongodb in memory to run
//different tests at the same time across diff projects

jest.mock("../nats-wrapper");

declare global {
  function signin(): string[];
}

let mongo: any;
// hook function runs before all the test
beforeAll(async () => {
  process.env.JWT_KEY = "srsg";
  mongo = await MongoMemoryServer.create();

  const mongoUri = mongo.getUri();
  //uri assumes you have set up auth foe mongoDB
  //and have created username and password for read and write access

  await mongoose.connect(mongoUri);
});

// hook function runs before each test

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
    //reset all the data inside the mongoose
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  // build a JWT payload. {id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  //create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Build session object. {JWT: MY_JWT}
  const session = { jwt: token };

  //turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  //take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  //return a string that the cookie with the encoded data
  return [`express:sess=${base64}`];
  // it is in an array for supertest expectation is that we wrap up
  // all different cookies in an array
};
