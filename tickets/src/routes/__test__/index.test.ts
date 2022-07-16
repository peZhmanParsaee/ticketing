import request from "supertest";
import { app } from "../../app";

const createTicket = () => {
    return request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "sample ticket",
            price: 20,
            userId: "sample-user-id",
        })
        .expect(201);
};

it("can fetch a list of tickets", async () => {
    await createTicket();
    await createTicket();
    await createTicket();

    const response = await request(app)
        .get("/api/tickets")
        .send()
        .expect(200);
    
    expect(response.body.length).toEqual(3);
});
