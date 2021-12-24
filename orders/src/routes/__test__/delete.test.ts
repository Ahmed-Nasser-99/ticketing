import { app } from "../../app";
import request from "supertest";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

it("marks an order to be cancelled on success", async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "party",
    price: 200,
  });
  await ticket.save();

  // create a user
  const user = global.signin();

  // make request to order the ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // delete the order
  const { body: fetchedOrder } = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(201);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("emits an order cancellation event", async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "party",
    price: 200,
  });
  await ticket.save();

  // create a user
  const user = global.signin();

  // make request to order the ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // delete the order
  const { body: fetchedOrder } = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
