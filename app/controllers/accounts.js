'use strict';
const User = require('../models/user');
const Boom = require('@hapi/boom');

const Accounts = {
    // home page (index)
    index: {
        auth: false,
        handler: function(request, h) {
            return h.view('main', { title: 'POI - islands' }); // Changes the tab at top of the web page
        }
    },

    showSignup: {
        auth: false,
        handler: function(request, h) {
            return h.view('signup', { title: 'Sign up for POI - islands' });
        } // we can only pass in values/variables from a "return h.view" method, not a redirect
    },

    signup: {
        auth: false,
        handler: async function(request, h) {
            try {
                const payload = request.payload;
                let user = await User.findByEmail(payload.email);
                if (user) {
                    const message = 'That Email address already exists!';
                    throw Boom.badData(message);
                }
                const newUser = new User({
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    email: payload.email,
                    password: payload.password,
                    userRole: 'member'
                });
                user = await newUser.save();
                request.cookieAuth.set({ id: user.id });    // This is how we can set a session cookie
                return h.redirect('/dashboard');
            } catch (err) {
                return h.view('signup', { errors: [{ message: err.message }] });
            }
        }
    },


    login: {
        auth: false,
        handler: async function(request, h) {
            const { email, password } = request.payload;
            try {
                let user = await User.findByEmail(email);
                if (!user) {
                    const message = 'That Email address is NOT registered';
                    throw Boom.unauthorized(message);
                }
                user.comparePassword(password);
                request.cookieAuth.set({ id: user.id });
                if (user.userRole == 'admin')
                    return h.redirect('/adminDashboard');
                else
                    return h.redirect('/dashboard');
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        }
    },

    logout: {
        auth: false,
        handler: function(request, h) {
            request.cookieAuth.clear(); // we can clear the session
            return h.redirect('/');
        }
    }

};

module.exports = Accounts;
