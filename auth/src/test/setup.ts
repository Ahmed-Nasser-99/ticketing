// we use this file in the package.json file in the jest segment

import  mongoose from "mongoose";
import { app } from "../app";
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from "supertest";
//MongoMemoryServer starts a copy of mongodb in memory to run
//different tests at the same time across diff projects

declare global {
  function signin(): Promise<string[]>;
}

let mongo:any;
// hook function runs before all the test
beforeAll(async () => {
    process.env.JWT_KEY = 'srsg';
    mongo = await MongoMemoryServer.create();
    
    const mongoUri = mongo.getUri();
    //uri assumes you have set up auth foe mongoDB 
    //and have created username and password for read and write access 

    await mongoose.connect(mongoUri);
});

// hook function runs before each test 

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections){
        await collection.deleteMany({});
        //reset all the data inside the mongoose
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
})

global.signin = async () => {
    const email = "test@test.com";
    const password = "password"

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email,
            password
        })
        .expect(201);

    const cookie = response.get('Set-Cookie');

    return cookie;
}