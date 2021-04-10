"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const bitBot_1 = require("./base/bitBot");
const client = new bitBot_1.BitBot({});
const init = () => {
    const commandsDir = path_1.default.join(__dirname, 'commands');
    fs_1.default.readdirSync(commandsDir).forEach(file => {
        if (!file.endsWith('.js'))
            return;
        client.loadCommand(commandsDir, file);
    });
    client.login(process.env.DISCORD_BOT_TOKEN);
};
init();
