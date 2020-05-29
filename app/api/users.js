"use strict";

const User = require("../models/user");
const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");
const utils = require("./utils.js");

const Users = {
  authenticate: {
    auth: false,
    handler: async function(request, h) {
      try {
        const user = await User.findOne({
          email: request.payload.email
        }).lean();
        console.log(`here is userID BACKEND: ${user._id}`);
        if (!user) {
          return Boom.unauthorized("User not found");
        } else if (user.password !== request.payload.password) {
          return Boom.unauthorized("Invalid password");
        } else {
          const token = utils.createToken(user);
          return h
            .response({ success: true, token: token, user: user._id })
            .code(201);
        }
      } catch (err) {
        return Boom.notFound("internal db failure");
      }
    }
  },

  create: {
    auth: false,
    // validate: {
    //   //  Hapi scoped module for validation
    //   payload: {
    //     // payload: his defines a schema which defines rules that our fields must adhere to
    //     firstName: Joi.string().required(),
    //     lastName: Joi.string().required(),
    //     email: Joi.string()
    //       .email()
    //       .required(),
    //     password: Joi.string().required()
    //   },
    //   options: {
    //     abortEarly: false
    //   },

    // failAction: This is the handler to invoke if one or more of the fields fails the validation.
    //   return h
    //     .view("signup", {
    //       title: "Sign up error",
    //       errors: error.details,
    //       user: request.payload // pass the details entered by the user into the signup view to avoid user having to re-enter some fields
    //     })
    //     .takeover()
    //     .code(400);
    // }
    // },
    handler: async function(request, h) {
      const newUser = new User(request.payload);
      const user = await newUser.save();
      if (user) {
        return h.response(user).code(201);
      }
      return Boom.badImplementation("error creating user");
    }
  },

  deleteAll: {
    auth: false,
    handler: async function(request, h) {
      await User.remove({});
      return { success: true };
    }
  },

  deleteOne: {
    auth: false,
    handler: async function(request, h) {
      const response = await User.deleteOne({ _id: request.params.id });
      if (response.deletedCount == 1) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    }
  },

  findOne: {
    auth: false,
    handler: async function(request, h) {
      try {
        const user = await User.findOne({ _id: request.params.id });
        if (!user) {
          return Boom.notFound("No User with this id");
        }
        return user;
      } catch (err) {
        return Boom.notFound("No User with this id");
      }
    }
  },

  find: {
    auth: false,
    handler: async function(request, h) {
      const users = await User.find();
      return users;
    }
  }

  // Dermot mess test
  // findBart: {
  //     //     auth: false,
  //     //     handler: async function(request, h) {
  //     //         const bart = await User.findOne({firstName: 'Bart'});
  //     //         return bart;
  //     //     }
  //     // },
};

module.exports = Users;
