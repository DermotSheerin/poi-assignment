'use strict';
// const User = require('../models/user');
const Boom = require('@hapi/boom');

const Accounts = {
    // home page (index)
    index: {
        auth: false,
        handler: function(request, h) {
            return h.view('main', { title: 'POI - islands' }); // Changes the tab at top of the web page
        }
    },

    // showSignup: {
    //     auth: false,
    //     handler: function(request, h) {
    //         return h.view('signup', { title: 'Sign up for Donations' });
    //     } // we can only pass in values/variables from a "return h.view" method, not a redirect, in Eamonns redirect method he was simply accessing one of the server objects i.e., donations array in server.bind in index.js, he then iterates thru "each donations" is used to iterate thru the array
    // },

    // signup: {
    //     auth: false,
    //     handler: async function(request, h) {
    //         try {
    //             const payload = request.payload;
    //             let user = await User.findByEmail(payload.email);
    //             if (user) {
    //                 const message = 'Email address already exists!';
    //                 throw Boom.badData(message);
    //             }
    //             const newUser = new User({
    //                 firstName: payload.firstName,
    //                 lastName: payload.lastName,
    //                 email: payload.email,
    //                 password: payload.password
    //             });
    //             user = await newUser.save();
    //             request.cookieAuth.set({ id: user.id });
    //             return h.redirect('/home');
    //         } catch (err) {
    //             return h.view('signup', { errors: [{ message: err.message }] });
    //         }
    //     }
    // },


    // showLogin: {
    //     auth: false,
    //     handler: function(request, h) {
    //         return h.view('login', { title: 'Login to Donations' });
    //     }
    // },

    login: {
        auth: false,
        handler: async function(request, h) {
            //request.cookieAuth.set({ id: user.id });
            console.log(request.email);
            return h.redirect('/dashboard');
        }
    },

};

module.exports = Accounts;
