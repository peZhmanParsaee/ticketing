import request from "supertest";
import mongoose from "mongoose";
import { OrderStatus } from "@pzhtickets/common";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

it("should delete order successfully", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: deletedOrder } = await request(app)
    .delete("/api/orders/"+order.id)
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(200);

  expect(order.id).toEqual(deletedOrder.id);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an order cancel event", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);
  
  await request(app)
    .delete("/api/orders/"+order.id)
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(200);
    
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
