"use strict";

const Users = require("./app/api/users");

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
  { method: "DELETE", path: "/api/users", config: Users.deleteAll }
];
