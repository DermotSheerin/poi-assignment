"use strict";

const Users = require("./app/api/users");
const Islands = require("./app/api/islands");

module.exports = [
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

  {
    method: "GET",
    path: "/api/islands/regionCategories",
    config: Islands.find
  },

  {
    method: "GET",
    path: "/api/islands/regionCategories/{filter}",
    config: Islands.categoryFilter
  }
];
