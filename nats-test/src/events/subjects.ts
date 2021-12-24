/*
  we may have a lot of subjects (channel names) 
  so it is a good idea to get all these names in an enum and use it instead of 
  writing the channel name every time (which sometimes leads to misspelling or typos)
*/

export enum Subjects {
  TicketCreated = "ticket-created",
  OrderUpdated = "order:updated",
}
