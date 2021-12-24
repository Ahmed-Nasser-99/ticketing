import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from "@ticketscourse/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
