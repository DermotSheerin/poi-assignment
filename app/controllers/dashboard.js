const Boom = require("@hapi/boom");
const Island = require("./islands");

const Dashboard = {
  dashboard: {
    handler: function(request, h) {
      return h.view("dashboard", { title: "POI Dashboard" });
    }
  }
};

module.exports = Dashboard;
