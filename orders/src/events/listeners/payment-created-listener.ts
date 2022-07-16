import { Subjects, Listener, PamentCreatedEvent, OrderStatus } from "@pzhtickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group.name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PamentCreatedEvent> {
  queueGroupName: string = queueGroupName;
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;

  async onMessage(data: PamentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error("Order not found!");
    }

    order.set({ status: OrderStatus.Complete });
    await order.save();

    msg.ack();
  }
}
