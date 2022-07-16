import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/tickets for post requests", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .send({});
    
    expect(response.status).not.toEqual(404);
});

it("can only be accessed if user is signed in", async () => {
    await request(app)
        .post("/api/tickets")
        .send({})
        .expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
    const cookie = signin();
    
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({});
    
    expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({ 
            title: "",
            price: 10
        })
        .expect(400);
    
    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            price: 10
        })
        .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({ 
            title: "title",
            price: -10
        })
        .expect(400);

    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "title"
        })
        .expect(400);
});

it("creates a ticket with valid inputs", async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toBe(0);

    const title = "abc";
    const price = 20;

    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({ title, price, userId: "blah" })
        .expect(201);
    
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(price);
    expect(tickets[0].title).toEqual(title);
});

it("publishes an event", async () => {
    const title = "abc";
    const price = 20;

    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({ title, price, userId: "blah" })
        .expect(201);
    
    // console.log(natsWrapper);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
