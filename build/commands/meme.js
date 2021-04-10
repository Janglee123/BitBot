"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const node_fetch_1 = __importDefault(require("node-fetch"));
const command_1 = require("../base/command");
module.exports = class extends command_1.Command {
    constructor(client) {
        super(client);
        this.name = 'meme';
        this.description = 'Memes form r/programmerHumor :)';
        this.usage = '`!meme`';
        this._data = [];
    }
    async run(msg, args) {
        const url = await this._getMeme() || '';
        msg.channel.send('', {
            files: [url]
        });
    }
    async _fetchData() {
        const base = await node_fetch_1.default('https://www.reddit.com/r/ProgrammerHumor/hot.json?limit=100').then(res => res.json());
        const collection = base.data.children;
        collection.forEach((e) => {
            const url = e.data.url_overridden_by_dest;
            if (url && url !== '') {
                this._data.push(url);
            }
        });
        setTimeout(() => {
            this._data = [];
        }, 1000 * 60 * 60 * 24);
    }
    async _getMeme() {
        if (this._data.length < 1) {
            await this._fetchData();
        }
        return this._data.shift();
    }
};
