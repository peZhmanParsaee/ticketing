import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20
  });

  await ticket.save();

  return ticket;
};

it("fetches orders for a particular user", async () => {
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = global.signin();
  const userTwo = global.signin();
  
  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  const { body: OrderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: OrderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .expect(200);
  
  // expect(ticketOne).toEqual(ticketOneResponse);
  // expect(ticketTwo).toEqual(ticketTwoResponse);
  // expect(ticketThree).toEqual(ticketThreeResponse);

  console.log(response.body);
  expect(response.body.length).toEqual(2);
  expect(response.body.some((order: any) => order.id === OrderOne.id));
  expect(response.body.some((order: any) => order.id === OrderTwo.id));
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketThree.id);
});
