"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const discord_js_1 = require("discord.js");
const command_1 = require("../base/command");
const codechef_1 = __importDefault(require("../service/codechef"));
module.exports = class extends command_1.Command {
    constructor(client) {
        super(client);
        this.name = 'cc';
        this.description = 'This is a prefix command for all codechef related commands.';
        this.usage = '`!cc <command> ...`';
    }
    init() {
        const FIVE_DAYS = 5 * 24 * 60 * 60 * 1000;
        setInterval(async () => {
            const members = await this._client.getAllMembers();
            members.forEach((profile, mem) => {
                this._updateRole(mem, profile.cfHandle);
            });
        }, FIVE_DAYS);
    }
    async run(msg, args) {
        const command = args.shift();
        switch (command) {
            case 'connect':
                this._connect(msg, args);
                break;
            case 'sub':
                this._sub(msg, args);
                break;
            case 'user':
                this._user(msg, args);
                break;
            case 'prob':
                this._problem(msg, args);
                break;
            case 'update':
                this._update(msg);
                break;
            default:
                this._help(msg);
        }
    }
    async _connect(msg, args) {
        if (args.length !== 1) {
            msg.reply('Usages: `!cc connect <username>`');
            return;
        }
        const username = args[0];
        const [probCode, probLink] = await codechef_1.default.fetchRandomProblem();
        msg.reply(`You have 1 minutes! Submit a code to the below question. It doesn't have to be correct just submit.\n${probLink}`);
        setTimeout(async () => {
            const submissionTime = await codechef_1.default.getLatestSubmissionDate(username, probCode).catch(console.log);
            if (!submissionTime) {
                msg.reply('Failed to verify your codechef account. You can try again.');
                return;
            }
            const timeDiff = new Date().getTime() - submissionTime.getTime();
            if (timeDiff > 6 * 60 * 1000) {
                msg.reply('Failed to verify your codechef account. You can try again.');
                return;
            }
            msg.reply(`You are now verified for Codechef user: ${username}!\nYour role will be added soon.`);
            if (msg.member) {
                this._setMemberHandle(msg.member, username);
                this._updateRole(msg.member, username);
            }
        }, 60 * 1000);
    }
    async _update(msg) {
        if (msg.member) {
            const profile = await this._client.getMemberInfo(msg.member);
            if (profile) {
                this._updateRole(msg.member, profile.cfHandle);
                msg.react('✅');
            }
            else {
                msg.reply('You are not registered yet, register yourself with `!batch <year>`');
            }
        }
    }
    async _problem(msg, args) {
        const argValues = ['school', 'easy', 'medium', 'hard', 'challenge'];
        const difficulty = args[0];
        if (args.length !== 1 || !argValues.includes(difficulty)) {
            msg.reply('Usages: `!cc prob [school|easy|medium|hard|challenge]`');
            return;
        }
        const [, probLink] = await codechef_1.default.fetchRandomProblem(difficulty);
        msg.channel.send(probLink);
    }
    async _sub(msg, args) {
        if (args.length !== 1) {
            msg.reply('Usages: `!cc sub <submission_id>`');
            return;
        }
        const id = args[0];
        const code = await codechef_1.default.getSubmission(id);
        let lang = '';
        if (code.includes('#include')) {
            lang = 'c++';
        }
        else if (code.includes('input()')) {
            lang = 'python';
        }
        else if (code.includes('import java')) {
            lang = 'java';
        }
        msg.channel.send(`\`\`\`${lang}\n ${code} \n\`\`\``);
    }
    async _user(msg, args) {
        if (args.length !== 1) {
            msg.reply('Usages: `!cc user <username>`');
            return;
        }
        const username = args[0];
        const user = await codechef_1.default.getUserInfo(username);
        const embed = new discord_js_1.MessageEmbed()
            .addField(user.name, user.username)
            .addField('Stars', user.stars, true)
            .addField('Rating', user.rating, true)
            .addField('Highest Rating', user.maxRating, true)
            .setColor(user.colorCode)
            .setTitle('Codechef Profile')
            .setDescription(user.link)
            .setThumbnail(user.iconURL);
        msg.channel.send(embed);
    }
    _help(msg) {
        const embed = new discord_js_1.MessageEmbed()
            .addField('`!cc connect <username>`', 'Gives you codechef star role.')
            .addField('`!cc prob [school|easy|medium|hard|challenge]`', 'Fetches random problem based on given difficulty.')
            .addField('`!cc sub <submission_id>`', 'Fetches source code of submission.')
            .addField('`!cc user <username>`', 'Prints user information.')
            .setTitle('Help!')
            .setDescription(this.description);
        msg.channel.send(embed);
    }
    async _setMemberHandle(member, username) {
        const profile = await this._client.getMemberInfo(member);
        if (profile) {
            profile.ccUsername = username;
            this._client.setMemberInfo(member, profile);
        }
    }
    async _updateRole(member, username) {
        const cfProfile = await codechef_1.default.getUserInfo(username);
        const roleName = `Codechef ${cfProfile.stars}★`;
        if (this._hasRole(member, roleName)) {
            return;
        }
        const reg = new RegExp(/Codechef/);
        const oldRole = this._hasRole(member, reg);
        if (oldRole) {
            member.roles.remove(oldRole);
        }
        let role = this._hasRole(member.guild, roleName);
        if (!role) {
            role = await this._createRole(member.guild, roleName, cfProfile.colorCode);
        }
        member.roles.add(role);
    }
};
