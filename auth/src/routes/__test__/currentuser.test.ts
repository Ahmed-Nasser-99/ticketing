import request from "supertest";
import { app } from "../../app";

it("response with details of the current user", async () => {
  const cookie = await global.signin();
  const res = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(400);
  // just a change
  expect(res.body.currentUser.email).toEqual("test@test.com");
});

it("not authorized", async () => {
  const res = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);
  expect(res.body.currentUser).toEqual(null);
});

/*const res = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200);
    console.log(res.body);
    we can't directly get the current user because supertest doesn't manage
    the cookies around the app so we have to pass the cookie from the signup
    stage to the other stages (this is a global solution for this problem that
    we encounter a lot so building a global function for it in the setup.ts 
    will make using the solution much easier than implementing it every time)*/
