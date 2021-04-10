"use strict";
const command_1 = require("../base/command");
const discord_js_1 = require("discord.js");
module.exports = class extends command_1.Command {
    constructor(client) {
        super(client);
        this.name = 'help';
        this.description = 'Displays all the available commands.';
        this.usage = '`!help [command]`';
    }
    async run(msg, args) {
        const commands = this._client.getCommands();
        const embed = new discord_js_1.MessageEmbed()
            .setTitle('Help!')
            .setDescription('Use theme with prefix `!` because sudo is not an option.');
        switch (args.length) {
            case 1:
                const name = args[0].trim();
                if (commands.has(name)) {
                    const c = commands.get(name);
                    embed.addField(c === null || c === void 0 ? void 0 : c.name, `${c === null || c === void 0 ? void 0 : c.description}\nusages: ${c === null || c === void 0 ? void 0 : c.usage}`);
                    msg.channel.send(embed);
                }
                else {
                    msg.channel.send(`Command ${name} not found.`);
                }
                break;
            case 0:
                commands.forEach(c => {
                    embed.addField(c.name, `${c.description}\nusages: ${c.usage}`);
                });
                msg.channel.send(embed);
                break;
            default:
                this._sendUsages(msg);
        }
    }
};
