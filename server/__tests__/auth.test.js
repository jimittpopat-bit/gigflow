const request = require("supertest");
const app = require("../index");

describe("Auth API", () => {
  it("should register a user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: `test${Date.now()}@mail.com`,
      password: "123456",
    });

    console.log("REGISTER STATUS:", res.statusCode);
    console.log("REGISTER BODY:", res.body);

    expect(res.statusCode).toBe(201);
  });

  it("should login a user", async () => {
    const email = `test${Date.now()}@mail.com`;

    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email,
      password: "123456",
    });

    const res = await request(app).post("/api/auth/login").send({
      email,
      password: "123456",
    });

    console.log("LOGIN STATUS:", res.statusCode);
    console.log("LOGIN BODY:", res.body);

    expect(res.statusCode).toBe(200);
  });
});



