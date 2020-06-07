"use strict";

const Users = require("./app/api/users");
const Islands = require("./app/api/islands");
const Regions = require("./app/api/regions");

module.exports = [
  // Users
  { method: "POST", path: "/api/users", config: Users.create },
  {
    method: "POST",
    path: "/api/users/authenticate",
    config: Users.authenticate
  },

  { method: "GET", path: "/api/users", config: Users.find },
  { method: "GET", path: "/api/users/{id}", config: Users.findOne },
  { method: "DELETE", path: "/api/users/{id}", config: Users.deleteOne },
  { method: "DELETE", path: "/api/users", config: Users.deleteAll },

  // Region/Category
  {
    method: "GET",
    path: "/api/regions/listRegions",
    config: Regions.find
  },

  // Islands
  {
    method: "GET",
    path: "/api/islands/find",
    config: Islands.find
  },
  {
    method: "GET",
    path: "/api/islands/regionCategories/{filter}",
    config: Islands.categoryFilter
  },
  {
    method: "GET",
    path: "/api/islands/getUserIslands/{userId}",
    config: Islands.getUserIslands
  },
  {
    method: "PUT",
    path: "/api/islands/editIslandDetails",
    config: Islands.editIslandDetails
  },
  {
    method: "GET",
    path: "/api/islands/showIslandDetails/{id}",
    config: Islands.showIslandDetails
  },
  {
    method: "POST",
    path: "/api/islands/addIsland",
    config: Islands.addIsland
  },
  {
    method: "POST",
    path: "/api/islands/addImage",
    config: Islands.addImage
  },
  {
    method: "DELETE",
    path: "/api/islands/deleteIsland/{id}",
    config: Islands.deleteOne
  },
  {
    method: "DELETE",
    path: "/api/islands/deleteAll", // function may need work
    config: Islands.deleteAll
  },
  {
    method: "PUT",
    path: "/api/islands/deleteImage",
    config: Islands.deleteImage
  }
];
