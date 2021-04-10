"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV !== 'production') {
    dotenv_1.default.config();
}
const app = express_1.default();
app.get('/', (req, res) => {
    console.log(Date.now() + ' Ping Received');
    res.sendStatus(200);
});
require('./client');
module.exports = app;
