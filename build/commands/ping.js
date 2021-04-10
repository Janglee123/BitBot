"use strict";
const command_1 = require("../base/command");
class Ping extends command_1.Command {
    constructor(client) {
        super(client);
        this.name = 'ping';
        this.description = 'Hello world command';
        this.usage = '`!ping`';
    }
    async run(msg, args) {
        msg.reply('Pong!');
    }
}
module.exports = Ping;
