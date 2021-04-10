"use strict";
const discord_js_1 = require("discord.js");
const command_1 = require("../base/command");
module.exports = class extends command_1.Command {
    constructor(client) {
        super(client);
        this.name = 'serverinfo';
        this.description = 'Shows server information';
        this.usage = '`!serverinfo`';
    }
    async run(msg, args) {
        var _a, _b;
        if (!msg.guild) {
            return;
        }
        const iconURL = msg.guild.iconURL() || undefined;
        const embed = new discord_js_1.MessageEmbed()
            .addField('Name', msg.guild.name, true)
            .addField('ID', msg.guild.id, true)
            .addField('Owner', `${(_a = msg.guild.owner) === null || _a === void 0 ? void 0 : _a.user.username}#${(_b = msg.guild.owner) === null || _b === void 0 ? void 0 : _b.user.discriminator}`, true)
            .addField('Members', `${msg.guild.members.cache.filter(member => !member.user.bot).size} Coders`, true)
            .addField('Channels', msg.guild.channels.cache.size, true)
            .addField('Roles', msg.guild.roles.cache.size, true)
            .addField('Creation Date', `${msg.guild.createdAt.toUTCString().substr(0, 16)} (${this._checkDays(msg.guild.createdAt)})`, true)
            .setAuthor(msg.guild.name || '', iconURL);
        if (iconURL) {
            embed.setThumbnail(iconURL);
        }
        msg.channel.send(embed);
    }
    _checkDays(date) {
        if (date === undefined) {
            return '';
        }
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / 86400000);
        return days + (days === 1 ? ' day' : ' days') + ' ago';
    }
};
