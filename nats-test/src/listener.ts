import { randomBytes } from "crypto";
import nats from "node-nats-streaming";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();
/*
kubectl port-forward nats-depl-747b747c58-8p96g 8222:8222
for the monitoring part in the nats-depl.yaml file 
localhost:8222/streaming 
*/
const stan = nats.connect(
  "ticketing",
  randomBytes(4).toString("hex"),
  // randomBytes(4).toString("hex") it is the client ID and it is random
  // so we can make more than one instance of the client with different IDs
  {
    url: "http://localhost:4222",
    // kubectl port-forward <pod-name> 4222:4222
    // to forward the incoming requests to port 4222 inside the pod
  }
);

stan.on("connect", () => {
  console.log("listener is now connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

/*
 when we close the client or restarting it by typing rs in the terminal
 we tell NATS not to wait for the heart beats and to fail twice in
 nats-depl.yaml file and just shut it off instantly
*/
process.on("SIGINT", () => stan.close()); //interrupt signal
process.on("SIGTERM", () => stan.close()); //terminate signal
