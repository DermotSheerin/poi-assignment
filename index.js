"use strict";

const ImageStore = require("./app/utils/image-store");
const Hapi = require("@hapi/hapi");
require("./app/models/db");
const utils = require("./app/api/utils.js");

// COMMENT OUT FOR PUBLIC DEPLOYMENT
// const dotenv = require("dotenv");

const server = Hapi.server({
  port: process.env.PORT || 3000,
  routes: { cors: true }
});

// COMMENT OUT FOR PUBLIC DEPLOYMENT
// const credentials = {
//   cloud_name: process.env.name,
//   api_key: process.env.key,
//   api_secret: process.env.secret
// };

// COMMENT OUT FOR PUBLIC DEPLOYMENT
// const result = dotenv.config();
// if (result.error) {
//   //  introduce a more orderly and informative error message + exit if there are problems starting the application
//   console.log(result.error.message);
//   process.exit(1);
// }

async function init() {
  await server.register(require("@hapi/inert")); // registering the plugins
  await server.register(require("@hapi/vision")); // https://hapi.dev/family/vision/ - Template rendering support for hapi.js - vision is part of the hapi ecosystem.
  await server.register(require("@hapi/cookie"));
  await server.register(require("hapi-auth-jwt2"));

  // ImageStore.configure(credentials);
  // USE THE FOLLOWING FOR PUBLIC DEPLOYMENT
  ImageStore.configure();
  server.validator(require("@hapi/joi")); // initialise Hapi

  server.views({
    // config object for vision in the views method
    engines: {
      hbs: require("handlebars")
    },
    relativeTo: __dirname,
    path: "./app/views",
    layoutPath: "./app/views/layouts",
    partialsPath: "./app/views/partials",
    layout: true,
    isCached: false
  });

  server.auth.strategy("session", "cookie", {
    // The parameters set a secure password for the cookie itself and a name for the cookie. Additionally, it is set to work over non-secure connections.
    cookie: {
      name: process.env.cookie_name,
      password: process.env.cookie_password,
      isSecure: false
    },
    redirectTo: "/"
  });

  server.auth.strategy("jwt", "jwt", {
    key: "secretpasswordnotrevealedtoanyone",
    validate: utils.validate,
    verifyOptions: { algorithms: ["HS256"] }
  });

  server.auth.default("session"); // protect all routes with the standard security strategy. We set this up as the strategy for all routes

  server.route(require("./routes"));
  server.route(require("./routes-api"));
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
