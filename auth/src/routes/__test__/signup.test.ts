import request from "supertest";
import { app } from "../../app";

it('returns 201 in successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
});

it('returns 400 with invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'tes5',
            password: 'password'
        })
        .expect(400);
});

it('returns 400 with invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: '2'
        })
        .expect(400);
});

it('disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
        // we may use await instead of return in the second one 
        //but in the first one it is mandatory 
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
});

it('sets a cookie after successful sign up', async () => {
    const res = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    expect(res.get('Set-Cookie')).toBeDefined();
});
