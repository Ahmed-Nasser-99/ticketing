import { Publisher, Subjects, TicketCreatedEvent } from "@ticketscourse/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
