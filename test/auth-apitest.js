"use strict";

const assert = require("chai").assert;
const IslandService = require("./island-service");
const seedData = require("./seedData.json");
const utils = require("../app/api/utils.js");

suite("Authentication API tests", function() {
  let users = seedData.users;
  let newUser = seedData.newUser;

  const islandService = new IslandService(seedData.islandService);

  suiteSetup(async function() {
    await islandService.deleteAllUsers();
  });

  suiteTeardown(async function() {
    await islandService.deleteAllUsers();
    islandService.clearAuth();
  });

  // test/island-service is our test client, this is the interface to our API

  test("authenticate", async function() {
    const returnedUser = await islandService.createUser(newUser);
    const response = await islandService.authenticate(newUser);

    const userInfo = utils.decodeToken(response.token);
    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.userId, returnedUser._id);
  });
});
