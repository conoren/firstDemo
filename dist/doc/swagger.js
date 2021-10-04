"use strict";
var swaggerAutogen = require("swagger-autogen")();
var doc = {
    info: {
        title: 'My API',
        description: 'Description',
    },
    host: 'localhost:3000',
    schemes: ['http'],
};
var outputFile = './dist/doc/swagger-output.json';
var endpointsFiles = ['./dist/server.js', './dist/config/passport-config.js'];
/* NOTE: if you use the express Router, you must pass in the
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */
swaggerAutogen(outputFile, endpointsFiles, doc);
//# sourceMappingURL=swagger.js.map