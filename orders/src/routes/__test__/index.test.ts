import { app } from "../../app";
import request from "supertest";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "party",
    price: 200,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();
  return ticket;
};

it("fetches orders for a particular user", async () => {
  // create three tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = global.signin();
  const userTwo = global.signin();

  // create one order for user #1
  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // create two order for user #2
  const { body: resOrderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: resOrderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // make request to get orders for user #2
  const { body: resUserTwoOrders } = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .expect(200);

  // Make sure we only got the orders for User #2
  expect(resUserTwoOrders.length).toEqual(2);
  expect(resUserTwoOrders[0].id).toEqual(resOrderOne.id);
  expect(resUserTwoOrders[1].id).toEqual(resOrderTwo.id);
  expect(resUserTwoOrders[0].ticket.id).toEqual(ticketTwo.id);
  expect(resUserTwoOrders[1].ticket.id).toEqual(ticketThree.id);
});
