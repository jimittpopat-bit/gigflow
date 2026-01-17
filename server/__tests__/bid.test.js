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

describe("Bid API", () => {
  it("should place bid", async () => {
    const client = {
      name: "Client",
      email: `client${Date.now()}@mail.com`,
      password: "123456",
    };

    const freelancer = {
      name: "Freelancer",
      email: `freelancer${Date.now()}@mail.com`,
      password: "123456",
    };

    const clientCookies = await registerAndLogin(client);
    const freelancerCookies = await registerAndLogin(freelancer);

    // client creates gig
    const gigRes = await request(app)
      .post("/api/gigs")
      .set("Cookie", clientCookies)
      .send({
        title: "Bid Gig",
        description: "Testing bids",
        budget: 300,
      });

    expect(gigRes.statusCode).toBe(201);

    // ✅ FIX: backend returns { gig: {...} }
    const gigId = gigRes.body.gig._id;

    // freelancer places bid ✅
    const bidRes = await request(app)
      .post("/api/bids")
      .set("Cookie", freelancerCookies)
      .send({
        gigId,
        amount: 250,
        message: "I can do this in 2 days",
      });

    expect(bidRes.statusCode).toBe(201);

    // ✅ FIX: backend returns { bid: {...} }
    expect(bidRes.body).toHaveProperty("bid");
    expect(bidRes.body.bid).toHaveProperty("_id");
  });

  it("should withdraw bid (only bidder)", async () => {
    const client = {
      name: "Client",
      email: `client${Date.now()}@mail.com`,
      password: "123456",
    };

    const freelancer = {
      name: "Freelancer",
      email: `freelancer${Date.now()}@mail.com`,
      password: "123456",
    };

    const otherFreelancer = {
      name: "Other Freelancer",
      email: `other${Date.now()}@mail.com`,
      password: "123456",
    };

    const clientCookies = await registerAndLogin(client);
    const freelancerCookies = await registerAndLogin(freelancer);
    const otherCookies = await registerAndLogin(otherFreelancer);

    // client creates gig
    const gigRes = await request(app)
      .post("/api/gigs")
      .set("Cookie", clientCookies)
      .send({
        title: "Withdraw Test",
        description: "Test withdraw bid",
        budget: 400,
      });

    expect(gigRes.statusCode).toBe(201);
    const gigId = gigRes.body.gig._id;

    // freelancer places bid
    const bidRes = await request(app)
      .post("/api/bids")
      .set("Cookie", freelancerCookies)
      .send({
        gigId,
        amount: 350,
        message: "Best price",
      });

    expect(bidRes.statusCode).toBe(201);
    const bidId = bidRes.body.bid._id;

    // other user cannot withdraw
    const failRes = await request(app)
      .delete(`/api/bids/${bidId}`)
      .set("Cookie", otherCookies);

    expect(failRes.statusCode).toBe(403);

    // bidder can withdraw
    const okRes = await request(app)
      .delete(`/api/bids/${bidId}`)
      .set("Cookie", freelancerCookies);

    expect(okRes.statusCode).toBe(200);
  });

  it("should hire bid (only owner)", async () => {
    const client = {
      name: "Client",
      email: `client${Date.now()}@mail.com`,
      password: "123456",
    };

    const freelancer = {
      name: "Freelancer",
      email: `freelancer${Date.now()}@mail.com`,
      password: "123456",
    };

    const clientCookies = await registerAndLogin(client);
    const freelancerCookies = await registerAndLogin(freelancer);

    // client creates gig
    const gigRes = await request(app)
      .post("/api/gigs")
      .set("Cookie", clientCookies)
      .send({
        title: "Hire Test",
        description: "Test hire flow",
        budget: 500,
      });

    expect(gigRes.statusCode).toBe(201);
    const gigId = gigRes.body.gig._id;

    // freelancer places bid
    const bidRes = await request(app)
      .post("/api/bids")
      .set("Cookie", freelancerCookies)
      .send({
        gigId,
        amount: 450,
        message: "I will deliver fast",
      });

    expect(bidRes.statusCode).toBe(201);
    const bidId = bidRes.body.bid._id;

    // client hires bid ✅
    const hireRes = await request(app)
      .patch(`/api/bids/${bidId}/hire`)
      .set("Cookie", clientCookies)
      .send({});

    expect(hireRes.statusCode).toBe(200);
  });
});
