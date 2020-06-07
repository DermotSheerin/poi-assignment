"use strict";

const User = require("../models/user");
const Island = require("../models/island");
const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");
const utils = require("./utils.js");
const ImageStore = require("../utils/image-store");

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
            .response({ success: true, token: token, user: user }) // pass back success result, token and user details to login function
            .code(201);
        }
      } catch (err) {
        return Boom.notFound("internal db failure");
      }
    }
  },

  // create: {
  //   auth: false,
  //   handler: async function(request, h) {
  //     let verifyUser = await User.findByEmail(request.payload.email);
  //     try {
  //       if (verifyUser) {
  //         const message = "That Email address already exists!";
  //         throw Boom.badData(message);
  //       }
  //       const newUser = new User(request.payload);
  //       const user = await newUser.save();
  //       if (user) {
  //         return h.response(user).code(201);
  //       }
  //       return Boom.badImplementation("error creating user");
  //     } catch (err) {}
  //   }
  // },

  create: {
    auth: false,
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
    auth: {
      strategy: "jwt"
    },
    handler: async function(request, h) {
      await User.remove({});
      return { success: true };
    }
  },

  deleteOne: {
    auth: {
      strategy: "jwt"
    },
    handler: async function(request, h) {
      try {
        const userID = request.params.id;
        const userIslands = await Island.findIslandsByUserId(userID).lean();
        await ImageStore.deleteUserIslandImages(userIslands); // delete users Island images from cloudinary before deleting the island and then deleting the user further below
        await Island.deleteIslandsByUserId(userID); // prior to deleting member, delete all islands associate with the member
        // await User.findByIdAndDelete(userID);
        const response = await User.deleteOne({ _id: userID });
        if (response.deletedCount === 1) {
          return { success: true };
        }
        return Boom.notFound("id not found");
      } catch (err) {
        return err.message;
      }
    }
  },

  findOne: {
    auth: {
      strategy: "jwt"
    },
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
    auth: {
      strategy: "jwt"
    },
    handler: async function(request, h) {
      const users = await User.find();
      return users;
    }
  }
};

module.exports = Users;
