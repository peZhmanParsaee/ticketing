import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";

import { Ticket } from "../../models/ticket";

it("fetches the order", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = global.signin();

  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      id: ticket.id,
      price: ticket.price,
    })
    .expect(201);
  
  const { body: orderTwo } = await request(app)
    .get("/api/orders/" + orderOne.id)
    .set("Cookie", user)
    .expect(200);
  
  expect(orderOne.id).toEqual(orderTwo.id);
});

it("returns an error if one user tries to fetch another users order", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = global.signin();

  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      id: ticket.id,
      price: ticket.price,
    })
    .expect(201);
  
  await request(app)
    .get("/api/orders/" + orderOne.id)
    .set("Cookie", global.signin())
    .expect(401);
});
