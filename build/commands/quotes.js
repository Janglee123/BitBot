"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const discord_js_1 = require("discord.js");
const command_1 = require("../base/command");
const quotes_1 = __importDefault(require("../static/quotes"));
module.exports = class extends command_1.Command {
    constructor(client) {
        super(client);
        this.name = 'quote';
        this.description = 'Sends random programming quote.';
        this.usage = '`!quote`';
    }
    async run(msg, args) {
        const random = Math.floor(Math.random() * quotes_1.default.length);
        const quote = quotes_1.default[random];
        console.log({ random, quote, length: quotes_1.default.length });
        const embed = new discord_js_1.MessageEmbed()
            .setTitle('Quote')
            .setDescription(`${quote.en} ― ${quote.author}`)
            .setFooter(`id: ${quote.id}`)
            .setColor('#0099ff');
        msg.channel.send({ embed });
    }
};
