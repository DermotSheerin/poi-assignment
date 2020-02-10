const Boom = require('@hapi/boom');
const Island = require('./islands');

const Dashboard = {
    dashboard: {
        handler: function(request, h) {
            return h.view('dashboard', { message: 'dashboard loaded now' });
        }
    },

};

module.exports = Dashboard;