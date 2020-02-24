const Boom = require("@hapi/boom");
const Island = require("./islands");

const AdminDashboard = {
  dashboard: {
    handler: function(request, h) {
      return h.view("adminDashboard", { title: "POI Dashboard - ADMIN" });
    }
  }
};

module.exports = AdminDashboard;
