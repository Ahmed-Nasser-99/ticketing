import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
  // kubectl port-forward nats-depl-747b747c58-8p96g 4222:4222
  // to forward the incoming requests to port 4222 inside the cluster
});

// this function will be executed after the client connects
// successfully to the NATS streaming server
stan.on("connect", async () => {
  console.log("publisher is now connected to NATS");

  const publisher = new TicketCreatedPublisher(stan);

  //we can't share a plain JS object so we have to convert it to JSON first
  //so we convert this object to JSON in the base-publisher.ts file
  await publisher.publish({
    id: "123",
    title: "party",
    price: 20,
  });
});
