import { Publisher, Subjects, TicketUpdatedEvent } from "@ticketscourse/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
