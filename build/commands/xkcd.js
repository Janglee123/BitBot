"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const node_fetch_1 = __importDefault(require("node-fetch"));
const command_1 = require("../base/command");
module.exports = class extends command_1.Command {
    constructor(client) {
        super(client);
        this.name = 'xkcd';
        this.description = 'Fetches random image from xkcd comics.';
        this.usage = '`!xkcd`';
    }
    async run(msg, args) {
        const base = await node_fetch_1.default('https://xkcd.com/info.0.json').then(res => res.json());
        const latestComicNo = base.num || 2000;
        const randomComicNo = Math.round(Math.random() * latestComicNo);
        const comic = await node_fetch_1.default(`https://xkcd.com/${randomComicNo}/info.0.json`).then(res => res.json());
        msg.channel.send(comic.alt, {
            files: [comic.img]
        });
    }
};
