const Boom = require('@hapi/boom');

const Dashboard = {
    dashboard: {
        handler: function(request, h) {
            console.log('any joy');
            return h.view('home', { message: 'Finally I got to dashboard?????', title: 'POI Dashboard' });
        }
    },

};

module.exports = Dashboard;