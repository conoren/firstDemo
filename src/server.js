require('./routes/appRoutes.js')

const express = require('express');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./doc/swagger-output.json')
const app = express();

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
