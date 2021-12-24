import {
  NotAuthError,
  NotFoundError,
  requireAuth,
} from "@ticketscourse/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";
import { body } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      //check if the input ID (ticketId) is a valid mongoDB ID
      .withMessage("TicketId must be provided"),
  ],
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");
    //populate => send the ticket with the data

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthError();
    }
    res.send(order);
  }
);

export { router as showOrderRouter };
