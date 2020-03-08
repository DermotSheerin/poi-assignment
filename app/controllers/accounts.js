"use strict";

// import modules
const User = require("../models/user");
const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");

const Accounts = {
  // home page (index)
  index: {
    auth: false,
    handler: function(request, h) {
      return h.view("main", { title: "POI - islands" }); // Changes the tab at top of the web page
    }
  },

  showSignup: {
    auth: false,
    handler: function(request, h) {
      return h.view("signup", { title: "Sign up for POI - islands" });
    } // we can only pass in values/variables from a "return h.view" method, not a redirect
  },

  signup: {
    auth: false,
    validate: {
      //  Hapi scoped module for validation
      payload: {
        // payload: his defines a schema which defines rules that our fields must adhere to
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().required()
      },
      options: {
        abortEarly: false
      },
      failAction: function(request, h, error) {
        // failAction: This is the handler to invoke if one or more of the fields fails the validation.
        return h
          .view("signup", {
            title: "Sign up error",
            errors: error.details,
            user: request.payload // pass the details entered by the user into the signup view to avoid user having to re-enter some fields
          })
          .takeover()
          .code(400);
      }
    },
    handler: async function(request, h) {
      try {
        const payload = request.payload;
        let user = await User.findByEmail(payload.email);
        if (user) {
          const message = "That Email address already exists!";
          throw Boom.badData(message);
        }
        const newUser = new User({
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: payload.password,
          userRole: "member", // all users signing up will be members
          islandCount: 0 // set islandCount to zero on registration, this will be used to track the amount of Islands created by each user
        });
        user = await newUser.save();
        request.cookieAuth.set({ id: user.id }); // This is how we can set a session cookie
        return h.redirect("/dashboard");
      } catch (err) {
        return h.view("signup", { errors: [{ message: err.message }] });
      }
    }
  },

  login: {
    auth: false,
    validate: {
      //  Hapi scoped module for validation
      payload: {
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().required()
      },
      options: {
        abortEarly: false
      },
      failAction: function(request, h, error) {
        return h
          .view("main", {
            title: "Sign up error",
            errors: error.details
          })
          .takeover()
          .code(400);
      }
    },
    handler: async function(request, h) {
      const { email, password } = request.payload;
      try {
        let user = await User.findByEmail(email);
        if (!user) {
          const message = "That Email address is NOT registered";
          throw Boom.unauthorized(message);
        }
        user.comparePassword(password);
        request.cookieAuth.set({ id: user.id });
        if (user.userRole === "admin") return h.redirect("/adminDashboard");
        // if user is an admin then redirect to the admin Dashboard, otherwise redirect to member dashboard for regular members
        else return h.redirect("/dashboard");
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    }
  },

  logout: {
    auth: false,
    handler: function(request, h) {
      request.cookieAuth.clear(); // we can clear the session
      return h.redirect("/");
    }
  },

  settings: {
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id).lean();
        return h.view("settings", {
          title: `${user.firstName}'s Settings`,
          user: user
        });
      } catch (err) {
        return h.view("dashboard", { errors: [{ message: err.message }] });
      }
    }
  },

  updateSettings: {
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().required()
      },
      options: {
        abortEarly: false
      },
      failAction: function(request, h, error) {
        return h
          .view("settings", {
            title: "Update Settings Error",
            errors: error.details,
            user: request.payload // On page refresh, re-populate the fields with their current values (leaving the problematic fields in their incorrect state)
          })
          .takeover()
          .code(400);
      }
    },
    handler: async function(request, h) {
      try {
        let updateUser = request.payload; // retrieves the updated user settings
        const id = request.auth.credentials.id;
        let user = await User.findById(id);
        user.firstName = updateUser.firstName;
        user.lastName = updateUser.lastName;
        user.email = updateUser.email;
        user.password = updateUser.password;
        await user.save();
        return h.redirect("/dashboard/listIslands");
      } catch (err) {
        return h.view("settings", { errors: [{ message: err.message }] });
      }
    }
  }
};

module.exports = Accounts;
