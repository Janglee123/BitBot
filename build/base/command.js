"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
class Command {
    constructor(client) {
        this._client = client;
        this.aliases = [];
        this.name = '';
        this.description = '';
        this.usage = '';
    }
    async run(msg, args) { }
    init() { }
    _sendUsages(msg) {
        msg.reply(this.usage);
    }
    async _createRole(guild, name, color) {
        return guild.roles.create({
            data: {
                name: name,
                color: color
            }
        });
    }
    async _removeRole(member, roleName) {
        const role = this._hasRole(member, roleName);
        if (role) {
            member.roles.remove(role);
        }
    }
    _hasRole(base, roleName) {
        return base.roles.cache.find(r => r.name.search(roleName) >= 0);
    }
}
exports.Command = Command;
