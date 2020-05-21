"use strict";

const assert = require("chai").assert;
const IslandService = require("./island-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");

suite("Candidate API tests", function() {
  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const islandService = new IslandService(fixtures.islandService);

  setup(async function() {
    await islandService.deleteAllUsers();
  });

  teardown(async function() {
    await islandService.deleteAllUsers();
  });

  // test('check if Bart exists', async function () {
  //   const bart = await donationService.getBart();
  //   assert.isDefined(bart._id);
  // });

  test("create a user", async function() {
    const returnedUser = await islandService.createUser(newUser);
    assert(
      _.some([returnedUser], newUser),
      "returnedCandidate must be a superset of newCandidate"
    );
    assert.isDefined(returnedUser._id);
  });

  test("get user", async function() {
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
    for (let c of users) {
      await islandService.createUser(c);
    }

    const allUsers = await islandService.getUsers();
    assert.equal(allUsers.length, users.length);
  });

  test("get users detail", async function() {
    for (let c of users) {
      await islandService.createUser(c);
    }

    const allUsers = await islandService.getUsers();
    for (var i = 0; i < users.length; i++) {
      assert(
        _.some([allUsers[i]], users[i]),
        "returnedUser must be a superset of newUser"
      );
    }
  });

  test("get all users empty", async function() {
    const allUsers = await islandService.getUsers();
    assert.equal(allUsers.length, 0);
  });
});
