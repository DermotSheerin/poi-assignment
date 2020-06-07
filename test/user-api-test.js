"use strict";

// JWT authentication applied to all Users routes except authentication and createUser

const assert = require("chai").assert;
const IslandService = require("./island-service");
const seedData = require("./seedData.json");
const _ = require("lodash");

suite("User API tests", function() {
  let users = seedData.users;
  let newUser = seedData.newUser;

  const islandService = new IslandService(seedData.islandService);

  suiteSetup(async function() {
    await islandService.deleteAllUsers();
    // const returnedUser = await islandService.createUser(newUser);
    // const response = await islandService.authenticate(newUser);
  });

  suiteTeardown(async function() {
    await islandService.deleteAllUsers();
    islandService.clearAuth();
  });

  setup(async function() {
    await islandService.deleteAllUsers();
  });

  teardown(async function() {
    await islandService.deleteAllUsers();
  });

  test("create a user", async function() {
    const returnedUser = await islandService.createUser(newUser);
    assert(
      _.some([returnedUser], newUser),
      "returnedUser must be a superset of newUser"
    );
    assert.isDefined(returnedUser._id);
  });

  test("get user", async function() {
    const response = await islandService.authenticate(newUser);
    const c1 = await islandService.createUser(newUser);
    const c2 = await islandService.getUser(c1._id);
    assert.deepEqual(c1, c2);
  });

  test("get invalid user", async function() {
    const c1 = await islandService.getUser("1234");
    assert.isNull(c1);
    const c2 = await islandService.getUser("012345678901234567890123");
    assert.isNull(c2);
  });

  test("delete a user", async function() {
    let c = await islandService.createUser(newUser);
    assert(c._id != null);
    await islandService.deleteOneUser(c._id);
    c = await islandService.getUser(c._id);
    assert(c == null);
  });

  test("get all users", async function() {
    await islandService.deleteAllUsers();
    const returnedUser = await islandService.createUser(newUser);
    const response = await islandService.authenticate(newUser);

    for (let c of users) {
      await islandService.createUser(c);
    }

    const allUsers = await islandService.getUsers();
    assert.equal(allUsers.length, users.length + 2);
  });

  test("get users detail", async function() {
    await islandService.deleteAllUsers();
    const user = await islandService.createUser(newUser);
    const response = await islandService.authenticate(newUser);

    for (let c of users) {
      await islandService.createUser(c);
    }

    const testUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password
    };
    users.unshift(testUser);

    const allUsers = await islandService.getUsers();
    for (var i = 0; i < users.length; i++) {
      assert(
        _.some([allUsers[i]], users[i]),
        "returnedUser must be a superset of newUser"
      );
    }
  });

  test("get all users empty", async function() {
    await islandService.deleteAllUsers();
    const user = await islandService.createUser(newUser);
    const response = await islandService.authenticate(newUser);
    const allUsers = await islandService.getUsers();
    assert.equal(allUsers.length, 1);
  });
});
