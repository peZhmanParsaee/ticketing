import request from "supertest";
import { app } from "../../app";

it("responds with details about with current user", async () => {
    // const authResponse = await request(app)
    //     .post("/api/users/signup")
    //     .send({
    //         email: "test@test.com",
    //         password: "password",
    //     })
    //     .expect(201);
    
    // const cookie = authResponse.get("Set-Cookie");

    const cookie = global.signin();
    
    const response = await request(app)
        .get("/api/users/currentuser")
        .set("Cookie", cookie)
        .send()
        .expect(200);
    
    expect(response.body.currentUser.email).toEqual('test@test.com');
});

it("responds with null if not authenticated", async () => {
    const response = await request(app)
        .get("/api/users/currentuser")
        .send()
        .expect(401);
    
    // expect(response.body.currentUser).toEqual(null);
});
