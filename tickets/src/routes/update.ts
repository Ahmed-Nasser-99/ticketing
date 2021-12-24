import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  NotAuthError,
  NotFoundError,
  validateRequest,
  requireAuth,
  BadRequestError,
} from "@ticketscourse/common";
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is empty"),
    body("price").isFloat({ gt: 0 }).withMessage("price must be > 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    // if the ticket doesn't exist
    if (!ticket) throw new NotFoundError();

    // if the ticket is reserved(has an order Id)
    if (ticket.orderId) throw new BadRequestError("ticket is reserved");

    // if the user doesn't own the ticket(different id)
    if (ticket.userId !== req.currentUser!.id) throw new NotAuthError();

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
