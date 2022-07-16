import jwt from "jsonwebtoken";
import mongoose from "mongoose";

beforeAll(async () => {
    process.env.JWT_KEY = "asdfasdf";
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    // put your client connection code here, example with mongoose:
    await mongoose.connect(process.env['MONGO_URI']!);
});

afterAll(async () => {
    await mongoose.disconnect();
})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

declare global {
    // namespace NodeJS {
    //     interface Global {
    //         // signin(): Promise<string[]>;
    //     }
    // }
    function signin(): string[];
}

global.signin = () => {
    // const email = "test@test.com";
    // const password = "password";
    // const response = await request(app)
    //     .post("/api/users/signup")
    //     .send({ email, password })
    //     .expect(201);
    // const cookie = response.get("Set-Cookie");
    // return cookie;

    // Build a JWT payload. { id, email }
    const payload = {
        id: 'asdfsdf',
        email: 'test@test.com'
    };

    // Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // BUILD session object { jwt: MY_JWT }
    const session = { jwt: token };

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString("base64");

    // Returns a string that is the cookie with encoded data
    return [`session=${base64}`];
};
