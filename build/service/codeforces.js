"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const node_fetch_1 = __importDefault(require("node-fetch"));
class Codeforces {
    static async getUserInfo(handle) {
        const data = await node_fetch_1.default(`https://codeforces.com/api/user.info?handles=${handle}`).then(res => res.json());
        if (data.status !== 'OK') {
            throw `Server Error: Could not found user: ${handle}.`;
        }
        const result = data.result[0];
        const user = {
            name: `${result.firstName} ${result.lastName}`,
            handle: handle,
            rank: result.rank.replace(/\b\w/g, (c) => c.toUpperCase()),
            maxRank: result.maxRank.replace(/\b\w/g, (c) => c.toUpperCase()),
            rating: result.rating,
            maxRating: result.maxRating,
            iconURL: `https:${result.avatar}`,
            colorCode: this.colors[result.rank],
            link: `https://codeforces.com/profile/${handle}`
        };
        return user;
    }
    static async getRandomProblem(tag = 'math') {
        const data = await node_fetch_1.default(`https://codeforces.com/api/problemset.problems?tags=${tag}`).then(res => res.json());
        if (data.status !== 'OK') {
            throw 'Server Error: Could not found problem.';
        }
        if (data.result.problems.length < 1) {
            throw `There is no problem with tag: ${tag}.`;
        }
        const random = Math.floor(Math.random() * data.result.problems.length);
        const problem = data.result.problems[random];
        return [problem.contestId, problem.index, `https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`];
    }
    static async getLatestSubmissionDate(handle, contestId, index) {
        const data = await node_fetch_1.default(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=100`).then(res => res.json());
        if (data.status !== 'OK') {
            throw 'Server Error: Could not fetch status of user.';
        }
        const status = data.result.find((res) => {
            return res.problem.contestId == contestId && res.problem.index == index;
        });
        if (!status) {
            throw `Could not find submission for contest: ${contestId}, index: ${index} of user ${handle}`;
        }
        return new Date(status.creationTimeSeconds * 1000);
    }
}
Codeforces.colors = {
    'newbie': '#808080',
    'pupil': '#008000',
    'specialist': '#03a89e',
    'expert': '#0000ff',
    'candidate master': '#aa00aa',
    'master': '#ff8c00',
    'international Master': '#ff8c00',
    'grandmaster': '#ff0000',
    'international grandmaster': '#ff0000',
    'legendary grandmaster': '#ff0000'
};
module.exports = Codeforces;
