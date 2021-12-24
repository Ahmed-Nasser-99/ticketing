import { OrderCreatedEvent, Publisher, Subjects } from "@ticketscourse/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
