import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  currentUser,
  errorHandler,
  NotFoundError,
} from "@ticketscourse/common";
import { createChargeRouter } from "./routes/new";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
    //secure if we don't make test
    //i.e the test we do in the signup.test.ts is not secured so it will
    //fail if the secure here is true
  })
);

app.use(currentUser);
app.use(createChargeRouter);
app.get("*", async (req, res, next) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app }; // the {} are required because we do a named export here
