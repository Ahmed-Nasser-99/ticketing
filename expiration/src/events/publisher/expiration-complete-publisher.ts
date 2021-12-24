import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@ticketscourse/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
