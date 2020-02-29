"use strict";

const Accounts = require("./app/controllers/accounts");
const Dashboard = require("./app/controllers/dashboard");
const AdminDashboard = require("./app/controllers/adminDashboard");
const Island = require("./app/controllers/islands");

module.exports = [
  // Accounts
  { method: "GET", path: "/", config: Accounts.index },
  { method: "POST", path: "/authenticate", config: Accounts.login },
  { method: "GET", path: "/logout", config: Accounts.logout },
  { method: "GET", path: "/showSignup", config: Accounts.showSignup },
  { method: "POST", path: "/signup", config: Accounts.signup },
  { method: "GET", path: "/settings", config: Accounts.settings },
  { method: "POST", path: "/settings", config: Accounts.updateSettings },

  // Member Dashboard
  { method: "GET", path: "/dashboard", config: Dashboard.dashboard },
  {
    method: "GET",
    path: "/dashboard/deleteIsland/{id}",
    config: Island.deleteUserIsland
  },
  // { // remove this if the route below works
  //   method: "GET",
  //   path: "/dashboard/{userID}/showIslandDetails/{id}",
  //   config: Island.showIslandDetails
  // },
  {
    method: "GET",
    path: "/dashboard/showIslandDetails/{id}",
    config: Island.showIslandDetails
  },
  {
    method: "POST",
    path: "/dashboard/editIslandDetails/{id}",
    config: Island.editIslandDetails
  },
  { method: "GET", path: "/dashboard/listIslands", config: Island.listIslands },
  {
    method: "GET", // retrieve islands for member using the drop down Region menu
    path: "/dashboard/{getIslands*}",
    config: Island.retrieveUserIslands
  },

  // Admin Dashboard
  { method: "GET", path: "/adminDashboard", config: AdminDashboard.dashboard },
  {
    method: "POST",
    path: "/adminDashboard/addRegion",
    config: AdminDashboard.addRegion
  },
  {
    method: "GET",
    path: "/adminDashboard/deleteUser/{id}",
    config: AdminDashboard.deleteMember
  },

  // Island
  { method: "POST", path: "/addIsland", config: Island.addIsland },
  {
    method: "GET",
    path: "/adminDashboard/{id}",
    config: Island.showMembersIslands
  },
  {
    method: "GET",
    path: "/adminDashboard/{userID}/deleteIsland/{id}",
    config: Island.deleteUserIsland
  },
  // {
  //   method: "GET",
  //   path: "/adminDashboard/deleteIsland/{id}",
  //   config: Island.deleteUserIsland
  // },
  // {
  //   method: "POST",
  //   path: "/dashboard/addIsland",
  //   config: {
  //     auth: {
  //       scope: "admin"
  //     },
  //     config: Island.addIsland
  //   }
  // },

  // { method: 'GET', path: '/login', config: Accounts.showLogin },

  {
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: "./public"
      }
    },
    options: { auth: false } // disable authentication on the static route for public folder i.e., images stored there
  }
];
