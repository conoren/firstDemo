"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var passportConfig = __importStar(require("./config/passport-config"));
var passport_1 = __importDefault(require("passport"));
var express_flash_1 = __importDefault(require("express-flash"));
var express_session_1 = __importDefault(require("express-session"));
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var swaggerFile = require('./doc/swagger-output.json');
var app = express_1.default();
require("dotenv").config();
var PORT = 3000;
app.use(auth_1.jwt());
app.use(cors_1.default());
passportConfig.initialize(passport_1.default);
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express_session_1.default({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(express_flash_1.default());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/doc', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerFile));
app.use(eventRoutes_1.default);
app.use(loginRoutes_1.default);
app.use(userRoutes_1.default);
app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});
//# sourceMappingURL=server.js.map