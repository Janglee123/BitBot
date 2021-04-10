"use strict";
const command_1 = require("../base/command");
const allowedSelfRoles = ['Competitive Programmer', 'Developer', 'Gamer', 'Linux', 'Windows'];
module.exports = class extends command_1.Command {
    constructor(client) {
        super(client);
        this.name = 'role';
        this.description = 'Get a role. Allowed roles are ' + allowedSelfRoles.toString() + '.';
        this.usage = '`!role <which>`';
    }
    async run(msg, args) {
        if (!msg.guild || !msg.member) {
            return;
        }
        if (args.length !== 1) {
            this._sendUsages(msg);
            return;
        }
        const roleName = args[0].toLowerCase();
        const reg = new RegExp(roleName, 'i');
        if (allowedSelfRoles.findIndex(s => reg.test(s)) < 0) {
            msg.reply('Select one of these: ' + allowedSelfRoles.toString() + '.');
            return;
        }
        const role = this._hasRole(msg.guild, reg);
        if (!role) {
            throw `Could not not find role ${roleName}`;
        }
        if (msg.member.roles.cache.has(role.id)) {
            msg.member.roles.remove(role);
        }
        else {
            msg.member.roles.add(role);
            msg.react('✅');
        }
    }
};
