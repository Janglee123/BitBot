"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitBot = void 0;
const path_1 = __importDefault(require("path"));
const discord_js_1 = require("discord.js");
const responses_1 = __importDefault(require("../static/responses"));
const keyv_1 = __importDefault(require("keyv"));
class BitBot extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this._prefix = '!';
        this._commands = new discord_js_1.Collection();
        this._aliases = new discord_js_1.Collection();
        this._addListeners();
        this._memberDB = new keyv_1.default(process.env.QOVERY_DATABASE_THE_DB_CONNECTION_URI, { namespace: 'member' });
    }
    _addListeners() {
        this.on('message', (msg) => {
            var _a, _b;
            if (msg.author.bot || !msg.guild)
                return;
            const prefixMention = new RegExp(`^<@!?${(_a = this.user) === null || _a === void 0 ? void 0 : _a.id}> ?$`);
            if (msg.content.match(prefixMention)) {
                const emote = msg.guild.emojis.cache.random();
                msg.react(emote);
            }
            if (!msg.content.startsWith(this._prefix))
                return;
            const args = msg.content.slice(this._prefix.length).trim().split(/ +/g);
            const commandName = ((_b = args.shift()) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || '';
            const command = this._commands.get(commandName);
            if (!command)
                return;
            try {
                command.run(msg, args);
            }
            catch (e) {
                console.error(e);
            }
        });
        this.on('guildMemberAdd', (member) => {
            const welcomeChannel = member.guild.systemChannel;
            if (welcomeChannel && member.user) {
                const random = Math.floor(Math.random() * responses_1.default.onJoin.length);
                const msg = responses_1.default.onJoin[random].replace('%name%', member.user.toString());
                welcomeChannel.send(msg);
            }
        });
        this.on('ready', () => console.log('I am ready!'));
    }
    loadCommand(commandPath, commandName) {
        try {
            const propsModule = require(path_1.default.join(commandPath, commandName));
            const props = new propsModule(this);
            props.init();
            this._commands.set(props.name, props);
            props.aliases.forEach(alias => {
                this._aliases.set(alias, props.name);
            });
        }
        catch (e) {
            console.error(`Unable to load command ${commandName}: ${e}`);
        }
    }
    getCommands() {
        return this._commands.clone();
    }
    async setMemberInfo(member, value) {
        const key = `${member.guild.id}/${member.user.id}`;
        this._memberDB.set(key, value);
    }
    async getMemberInfo(member) {
        const key = `${member.guild.id}/${member.user.id}`;
        return this._memberDB.get(key);
    }
    async getAllMembers() {
        const members = new Map();
        this.guilds.cache.forEach(guild => {
            guild.members.cache.forEach(async (mem) => {
                const memProf = await this.getMemberInfo(mem);
                if (memProf) {
                    members.set(mem, memProf);
                }
            });
        });
        return members;
    }
}
exports.BitBot = BitBot;
