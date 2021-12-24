import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> /*generic type of arguments*/ {
  //abstract -> must be defined in a child subclass
  abstract subject: T["subject"];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(
    data: T["data"]
  ): Promise<void> /* to have an appropriate promise type rather thank unknown */ {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) return reject(err); // if something goes wrong return
        console.log("Event Published", this.subject);
        resolve(); // if the promise is completed successfully
      });
    });
  }
}
