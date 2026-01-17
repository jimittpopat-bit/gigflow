const mongoose = require("mongoose");
require("dotenv").config();

beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
  await mongoose.connect(mongoUri);

  console.log("✅ Connected DB in tests:", mongoose.connection.db.databaseName);
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
