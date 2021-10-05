"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
var loginRoutes_1 = __importDefault(require("./routes/loginRoutes"));
var userRoutes_1 = __importDefault(require("./routes/userRoutes"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var auth_1 = require("./middlewares/auth");
var passportConfig = require("./config/passport-config");
var passport = require("passport");
var flash = require("express-flash");
var session = require("express-session");
var swaggerUi = require('swagger-ui-express');
var swaggerFile = require('./doc/swagger-output.json');
var app = express_1.default();
require("dotenv").config();
var PORT = 3000;
app.use(auth_1.jwt());
app.use(cors_1.default());
passportConfig.initialize(passport);
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
//app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(eventRoutes_1.default);
app.use(loginRoutes_1.default);
app.use(userRoutes_1.default);
app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});
//# sourceMappingURL=server.js.map