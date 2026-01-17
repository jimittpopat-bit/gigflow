const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
  // Increase timeout for CI environments
  jest.setTimeout(60000);

  // Create MongoDB Memory Server with proper configuration
  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: "testdb",
    },
  });
  
  const uri = mongoServer.getUri();

  // Disconnect any existing connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  // Connect to the in-memory database
  await mongoose.connect(uri);
}, 60000);

afterEach(async () => {
  if (!mongoose.connection?.db) return;

  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  // Close mongoose connection
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  // Stop the in-memory server
  if (mongoServer) {
    await mongoServer.stop();
  }
}, 60000);