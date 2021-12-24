import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> /*generic type of arguments*/ {
  //abstract -> must be defined in a child subclass
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000; // 5 secs waiting to ack

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
    /*
    setDeliverAllAvailable() -> get all the previous messages stored in the
    NATS storage 
    setDurableName(any name) -> check if the queue group has already received
    the messages or not before sending all the previous messages
  */
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject, // the object we want to listen to (ticket:created for example)
      this.queueGroupName,
      this.subscriptionOptions()
    );
    /*
      when event gets published and there are 2 listeners the 2 listeners
      will listen to that message and store it. So the queue group
      will send the message TO ONE AND ONLY ONE of the
      subscribers assigned to the queue group
    */

    subscription.on("message", (msg: Message) => {
      console.log(
        `Message Received: Subject Is ${this.subject} / Queue Group Name Is ${this.queueGroupName} `
      );
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8")); // we don't expect to get a buffer but just in case
  }
}
