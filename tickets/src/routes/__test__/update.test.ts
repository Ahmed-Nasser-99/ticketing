import request from "supertest";
import { Ticket } from "../../models/ticket";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

it("return 404 if the provided id is not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "awdwd",
      price: 20,
    })
    .expect(404);
});

it("return 401 if the user doesn't own the ticket", async () => {
  const res = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", global.signin())
    .send({
      title: "wfawf",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "awwgadwd",
      price: 30,
    })
    .expect(401);

  //it is different id in the second await from what it is from the first one
  //check the setup.ts file in the global.signin()
});

it("return 401 if invalid title or price", async () => {
  const cookie = global.signin();

  const res = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "wfawf",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 30,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "gawfaw",
      price: -91,
    })
    .expect(400);
});

it("update the ticket for valid parameters", async () => {
  const cookie = global.signin();
  const newTitle = "new Title";
  const newPrice = 25;

  const res = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "wfawf",
      price: 20,
    });
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: newTitle,
      price: newPrice,
    })
    .expect(200);
  const ticketResponse = await await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send();
  expect(ticketResponse.body.title).toEqual(newTitle);
  expect(ticketResponse.body.price).toEqual(newPrice);
});

it("publishes an event", async () => {
  const title = "awdasf";
  const price = 20;
  const cookie = global.signin();

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "newTitle",
      price: 154,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
it("rejects edits on a reserved ticket", async () => {
  const title = "awdasf";
  const price = 20;
  const cookie = global.signin();

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price,
    });

  const ticket = await Ticket.findById(res.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "newTitle",
      price: 45,
    })
    .expect(400);
});
