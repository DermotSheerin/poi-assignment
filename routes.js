'use strict';

const Accounts = require('./app/controllers/accounts');
const Dashboard = require('./app/controllers/dashboard');
const Island = require('./app/controllers/islands');

module.exports = [
    { method: 'GET', path: '/', config: Accounts.index },
    { method: 'POST', path: '/authenticate', config: Accounts.login },
    { method: 'GET', path: '/dashboard', config: Dashboard.dashboard },

    { method: 'POST', path: '/dashboard/addRegion', config: Island.addRegion },
    { method: 'POST', path: '/dashboard/addIsland', config: Island.addIsland },
    { method: 'GET', path: '/dashboard/listIslands', config: Island.listIslands },
    { method: 'GET', path: '/dashboard/{getIslands*}', config: Island.retrieveIslands },


    { method: 'GET', path: '/showSignup', config: Accounts.showSignup },
    { method: 'POST', path: '/signup', config: Accounts.signup },

    // { method: 'GET', path: '/login', config: Accounts.showLogin },


    {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: './public'
            }
        },
        options: { auth: false }    // disable authentication on the static route for public folder i.e., images stored there
    }
];
