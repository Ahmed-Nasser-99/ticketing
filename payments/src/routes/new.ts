import {
  BadRequestError,
  NotAuthError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@ticketscourse/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { natsWrapper } from "../nats-wrapper";
import { stripe } from "../stripe";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("token").not().isEmpty().withMessage("token is empty"),
    body("orderId").not().isEmpty().withMessage("no order found"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAuthError();

    // we already sure the user is authorized from the requireAuth middleware
    // so we put ! in the req.currentUser!.id for TS

    if (order.status === OrderStatus.Canceled)
      throw new BadRequestError("sorry it is a cancelled order");

    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100, // to convert from dollars to cents
      source: token,
    });
    // the stripe api will return an object with some info about the payment
    // including the id of the payment

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
