"use strict";

const assert = require("chai").assert;
const IslandService = require("./island-service");
const fixtures = require("./fixtures.json");
const utils = require("../app/api/utils.js");

suite("Authentication API tests", function() {
  let users = fixtures.users;

  let newUser = fixtures.newUser;

  const islandService = new IslandService(fixtures.islandService);

  suiteSetup(async function() {
    await islandService.deleteAllUsers();
    const returnedUser = await islandService.createUser(newUser);
    const response = await islandService.authenticate(newUser);
  });

  suiteTeardown(async function() {
    await islandService.deleteAllUsers();
    islandService.clearAuth();
  });

  // islandService is our test client, this is the interface to our API

  test("authenticate", async function() {
    const returnedUser = await islandService.createUser(newUser);
    const response = await islandService.authenticate(newUser);

    const userInfo = utils.decodeToken(response.token);
    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.userId, returnedUser._id);
  });
});
