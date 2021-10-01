"use strict";
require('./routes/appRoutes.js');
var express = require('express');
var swaggerUi = require('swagger-ui-express');
var swaggerFile = require('./doc/swagger-output.json');
var app = express();
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
