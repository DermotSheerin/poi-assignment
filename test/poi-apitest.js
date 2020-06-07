"use strict";

const assert = require("chai").assert;
const IslandService = require("./island-service");
const seedData = require("./seedData.json");
const utils = require("../app/api/utils.js");
const _ = require("lodash");

suite("POI API tests", function() {
  let users = seedData.users;
  let regions = seedData.regions;
  let islands = seedData.islands;
  let newUser = seedData.newUser;

  const islandService = new IslandService(seedData.islandService);

  suiteSetup(async function() {
    await islandService.deleteAllUsers();
    const returnedUser = await islandService.createUser(newUser);
    const response = await islandService.authenticate(newUser);
  });

  suiteTeardown(async function() {
    await islandService.deleteAllUsers();
    islandService.clearAuth();
  });

  setup(async function() {
    await islandService.deleteAllIslands();
    const returnedUser = await islandService.createUser(newUser);
    const response = await islandService.authenticate(newUser);
  });

  teardown(async function() {});

  test("Return all regions", async function() {
    const returnedRegions = await islandService.getAllRegions();
    assert(
      _.some([returnedRegions[1]], regions[1]),
      "returnedRegions must be a superset of regions[1]"
    );
    assert.isDefined(returnedRegions[1]._id);
  });

  test("Create an Island", async function() {
    // had some issues trying to create a reference to regions object array from Islands object array in the seedData
    // so currently not doing an assert to check if the returned islands is a superset of islands[0] - to be added later
    const returnedIsland = await islandService.createIsland(islands[0]);
    assert.isDefined(returnedIsland._id);
  });

  test("Return all Islands", async function() {
    for (let island of islands) {
      await islandService.createIsland(island);
    }
    const allIslands = await islandService.retrieveAllIslands();
    assert.equal(allIslands.length, islands.length);
  });

  test("Retrieve a single Island", async function() {
    const islandNew = await islandService.createIsland(islands[0]);
    const islandNew2 = await islandService.retrieveOneIsland(islandNew._id);
    assert.isDefined(islandNew2.islandDetails._id);
  });

  // To be completed ....
  // test("Retrieve islands in Region", async function() {});
  //
  // test("Retrieve all islands for User", async function() {});
  //
  // test("Add images to Island", async function() {});
});
