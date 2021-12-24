import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@ticketscourse/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    title: "party",
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  // create the fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    expiresAt: "fakeValue",
    userId: ticket.userId,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // create the fake data object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
    // jest.fn() => mock function that keeps track of how many times it get called
    // and what argument it has provided
  };

  return { ticket, data, msg, listener };
};

it("sets the orderId of the ticket", async () => {
  const { ticket, data, msg, listener } = await setup();

  await listener.onMessage(data, msg);

  // the ticket have some out-of-date data so we need to fetch it again
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { ticket, data, msg, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { ticket, data, msg, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
