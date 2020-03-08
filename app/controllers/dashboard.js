const Region = require("../models/region");
const User = require("../models/user");

const Dashboard = {
  dashboard: {
    handler: async function(request, h) {
      try {
        const userId = request.auth.credentials.id;
        const user = await User.findById(userId).lean();
        const regions = await Region.find({}).lean();

        return h.view("dashboard", {
          title: "POI Dashboard",
          userId: userId,
          user: user,
          regions: regions
        });
      } catch (err) {
        return h.view("dashboard", { errors: [{ message: err.message }] });
      }
    }
  }
};

module.exports = Dashboard;
