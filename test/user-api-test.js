"use strict";

const assert = require("chai").assert;
const DonationService = require("./donation-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");

suite("Candidate API tests", function() {
  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const donationService = new DonationService(fixtures.donationService);

  setup(async function() {
    await donationService.deleteAllUsers();
  });

  teardown(async function() {
    await donationService.deleteAllUsers();
  });

  // test('check if Bart exists', async function () {
  //   const bart = await donationService.getBart();
  //   assert.isDefined(bart._id);
  // });

  test("create a user", async function() {
    const returnedUser = await donationService.createUser(newUser);
    assert(
      _.some([returnedUser], newUser),
      "returnedCandidate must be a superset of newCandidate"
    );
    assert.isDefined(returnedUser._id);
  });

  test("get user", async function() {
    const c1 = await donationService.createUser(newUser);
    const c2 = await donationService.getUser(c1._id);
    assert.deepEqual(c1, c2);
  });

  test("get invalid user", async function() {
    const c1 = await donationService.getUser("1234");
    assert.isNull(c1);
    const c2 = await donationService.getUser("012345678901234567890123");
    assert.isNull(c2);
  });

  test("delete a user", async function() {
    let c = await donationService.createUser(newUser);
    assert(c._id != null);
    await donationService.deleteOneUser(c._id);
    c = await donationService.getUser(c._id);
    assert(c == null);
  });

  test("get all users", async function() {
    for (let c of users) {
      await donationService.createUser(c);
    }

    const allUsers = await donationService.getUsers();
    assert.equal(allUsers.length, users.length);
  });

  test("get users detail", async function() {
    for (let c of users) {
      await donationService.createUser(c);
    }

    const allUsers = await donationService.getUsers();
    for (var i = 0; i < users.length; i++) {
      assert(
        _.some([allUsers[i]], users[i]),
        "returnedUser must be a superset of newUser"
      );
    }
  });

  test("get all users empty", async function() {
    const allUsers = await donationService.getUsers();
    assert.equal(allUsers.length, 0);
  });
});
