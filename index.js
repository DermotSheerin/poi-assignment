'use strict';

const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
    console.log(result.error.message);
    process.exit(1);
}

const Hapi = require('@hapi/hapi');
require('./app/models/db');

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

async function init() {
    await server.register(require('@hapi/inert')); // registering the plugins
    await server.register(require('@hapi/vision')); // https://hapi.dev/family/vision/ - Template rendering support for hapi.js - vision is part of the hapi ecosystem.
    await server.register(require('@hapi/cookie'));

    server.views({
        // config object for vision in the views method
        engines: {
            hbs: require('handlebars')
        },
        relativeTo: __dirname,
        path: './app/views',
        layoutPath: './app/views/layouts',
        partialsPath: './app/views/partials',
        layout: true,
        isCached: false
    });

    // server.auth.strategy('session', 'cookie', {
    //     cookie: {
    //         name: process.env.cookie_name,
    //         password: process.env.cookie_password,
    //         isSecure: false
    //     },
    //     redirectTo: '/'
    // });

    //server.auth.default('session'); // protect all routes with the standard security strategy.

    server.route(require('./routes'));
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});

init();