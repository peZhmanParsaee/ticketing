import { Publisher, PamentCreatedEvent, Subjects } from "@pzhtickets/common";

export class PaymentCreatedPublisher extends Publisher<PamentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
