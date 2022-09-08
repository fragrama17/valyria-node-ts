"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var valyria_1 = require("./routes/valyria");
var body_parser_1 = __importDefault(require("body-parser"));
var mongoose_1 = require("mongoose");
var dev_1 = require("./config/dev");
var app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use('/api/v1', valyria_1.router);
(0, mongoose_1.connect)(dev_1.dbUri)
    .then(function () { return app.listen(3000, function () {
    console.log('Connected to mongoDB locally');
    console.log('Listening on port 3000');
}); })
    .catch(function (err) { return console.log('error starting the server', err); });
