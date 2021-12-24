import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from "@ticketscourse/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
