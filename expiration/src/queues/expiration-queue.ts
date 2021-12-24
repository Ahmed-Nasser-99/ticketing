import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publisher/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
  orderId: string;
  // the data will be inside the job
}

const expirationQueue = new Queue<Payload>(
  "order:expiration",
  /* 
    the name of the channel in redis that we are going to store the job
    temporarily 
  */ {
    redis: {
      host: process.env.REDIS_HOST,
      // the environment variable in the expiration-depl.yaml
      // the name of the hostname of the redis server we want to connect to
    },
  }
);

expirationQueue.process(async (job) => {
  // the process that will be done to the job
  // when the job ends the delay in the redis
  // and come back to expiration service
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
