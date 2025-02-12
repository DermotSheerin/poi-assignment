"use strict";

require("dotenv").config();

const Mongoose = require("mongoose");

Mongoose.set("useNewUrlParser", true);
Mongoose.set("useUnifiedTopology", true);

async function seed() {
  let seeder = require("mais-mongoose-seeder")(Mongoose);
  const data = require("./seed-data.json");
  const Region = require("./region");
  const Island = require("./island");
  const User = require("./user");
  const dbData = await seeder.seed(data, {
    dropDatabase: false,
    dropCollections: true
  });
  console.log(dbData);
}

Mongoose.connect(process.env.db, { useFindAndModify: false }); // to prevent several deprecations in the MongoDB Node.js driver --> https://mongoosejs.com/docs/deprecations.html#-findandmodify-
const db = Mongoose.connection;

db.on("error", function(err) {
  console.log(`database connection error: ${err}`);
});

db.on("disconnected", function() {
  console.log("database disconnected");
});

db.once("open", function() {
  console.log(`database connected to ${this.name} on ${this.host}`);
  seed();
});
