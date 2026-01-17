const request = require("supertest");
const app = require("../index");

const registerAndLogin = async (user) => {
  await request(app).post("/api/auth/register").send(user).expect(201);

  const loginRes = await request(app).post("/api/auth/login").send({
    email: user.email,
    password: user.password,
  });

  expect(loginRes.statusCode).toBe(200);

  const cookies = loginRes.headers["set-cookie"];
  expect(cookies).toBeTruthy();

  return cookies;
};

describe("Gig API", () => {
  it("should create gig (auth required)", async () => {
    const user = {
      name: "Client",
      email: `client${Date.now()}@mail.com`,
      password: "123456",
    };

    const cookies = await registerAndLogin(user);

    const res = await request(app)
      .post("/api/gigs")
      .set("Cookie", cookies)
      .send({
        title: "Logo Design",
        description: "Need a professional logo",
        budget: 500,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("gig");
    expect(res.body.gig).toHaveProperty("_id");
  });

  it("should edit gig (only owner)", async () => {
    const owner = {
      name: "Owner",
      email: `owner${Date.now()}@mail.com`,
      password: "123456",
    };

    const ownerCookies = await registerAndLogin(owner);

    const gigRes = await request(app)
      .post("/api/gigs")
      .set("Cookie", ownerCookies)
      .send({
        title: "Website",
        description: "Need a portfolio website",
        budget: 1000,
      });

    expect(gigRes.statusCode).toBe(201);

    // ✅ FIX: remove wrong bidId line + correct gig path
    const gigId = gigRes.body.gig._id;

    const updateRes = await request(app)
      .patch(`/api/gigs/${gigId}`)
      .set("Cookie", ownerCookies)
      .send({
        title: "Website Updated",
        budget: 1200,
      });

    expect(updateRes.statusCode).toBe(200);
  });

  it("should NOT edit gig (non-owner -> 403)", async () => {
    const owner = {
      name: "Owner",
      email: `owner${Date.now()}@mail.com`,
      password: "123456",
    };

    const other = {
      name: "Other",
      email: `other${Date.now()}@mail.com`,
      password: "123456",
    };

    const ownerCookies = await registerAndLogin(owner);
    const otherCookies = await registerAndLogin(other);

    const gigRes = await request(app)
      .post("/api/gigs")
      .set("Cookie", ownerCookies)
      .send({
        title: "Editing Test",
        description: "Only owner should edit this",
        budget: 200,
      });

    expect(gigRes.statusCode).toBe(201);
    const gigId = gigRes.body.gig._id;

    const res = await request(app)
      .patch(`/api/gigs/${gigId}`)
      .set("Cookie", otherCookies)
      .send({ title: "Hacked Title" });

    expect(res.statusCode).toBe(403);
  });
});
