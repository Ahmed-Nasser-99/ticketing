import request from "supertest";
import { app } from "../../app";

it('clears the cookie after sign out', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    const res = await request(app)
        .post('/api/users/signout')
        .send({})
        .expect(200);
    expect(res.get('Set-Cookie')[0]).toEqual("express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly");
    //the 'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
    //is what the cookie logged when we did console.log(res.get('Set-Cookie'))
    //so we expect the exact same content in the cookie after signing out
    
});