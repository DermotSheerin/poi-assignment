const Boom = require("@hapi/boom");
const Island = require("../models/island");

const Dashboard = {
  dashboard: {
    handler: async function(request, h) {
      const userId = request.auth.credentials.id;
      //const user = await User.findById(userId);
      // const userIslandsInRegion = await Island.findIslandsByUserId(userId)
      //   .populate("user")
      //   .populate("region")
      //   .lean(); // Retrieve all islands belonging to this user and render to view

      return h.view("dashboard", {
        title: "POI Dashboard",
        userId: userId
      });
    }
  }
};

module.exports = Dashboard;
