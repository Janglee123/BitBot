"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const node_fetch_1 = __importDefault(require("node-fetch"));
const cheerio_1 = __importDefault(require("cheerio"));
class Codechef {
    static async getUserInfo(username) {
        const html = await node_fetch_1.default(`https://www.codechef.com/users/${username}`).then(res => res.text());
        const $ = cheerio_1.default.load(html);
        const stars = $('.rating-star').text().length;
        if (stars === 0) {
            throw 'Could not found user.';
        }
        const user = {
            username: username,
            name: $('div.user-details-container header h2').text(),
            stars: stars,
            rating: parseInt($('.rating-number').text()),
            maxRating: parseInt($('div.rating-header small').text().replace(/\D/g, '')),
            iconURL: $('div.user-details-container header img').attr('src') || '',
            colorCode: this.colors[stars],
            link: `https://www.codechef.com/users/${username}`
        };
        if (user.iconURL.startsWith('/')) {
            user.iconURL = 'https://www.codechef.com' + user.iconURL;
        }
        return user;
    }
    static async getLatestSubmissionDate(username, problemCode) {
        const html = await node_fetch_1.default(`https://www.codechef.com/status/${problemCode},${username}`).then(res => res.text());
        const $ = cheerio_1.default.load(html);
        const dateString = $('table.dataTable tbody tr').first().find('td').first().next().text();
        return this.parseDateString(dateString);
    }
    static parseDateString(dateString) {
        const time = new Date();
        const [arg1, arg2, arg3] = dateString.split(' ');
        if (arg2 === 'sec') {
            const secDiff = time.getSeconds() - parseInt(arg1);
            time.setSeconds(secDiff);
        }
        else if (arg2 === 'min') {
            const minDiff = time.getMinutes() - parseInt(arg1);
            time.setMinutes(minDiff);
        }
        else if (arg2 === 'hours') {
            const hoursDiff = parseInt(arg1);
            time.setHours(hoursDiff);
        }
        else if (arg2 in ['AM', 'PM']) {
            let [mins, hours] = arg1.split(':').map(parseInt);
            if (arg2 === 'PM') {
                hours += 12;
            }
            const [date, month, year] = arg3.split('/').map(parseInt);
            time.setHours(hours, mins);
            time.setFullYear(year + 2000, month - 1, date);
        }
        else {
            throw `Can not parse the date ${dateString}`;
        }
        return time;
    }
    static async fetchRandomProblem(difficulty = 'easy') {
        const argValues = ['school', 'easy', 'medium', 'hard', 'challenge'];
        if (!argValues.includes(difficulty)) {
            throw 'Wrong difficulty type';
        }
        const html = await node_fetch_1.default(`https://www.codechef.com/problems/${difficulty}`).then(res => res.text());
        const $ = cheerio_1.default.load(html);
        const links = [];
        $('table.dataTable tbody tr td div a').each((i, e) => {
            const link = $(e).attr('href');
            if (typeof (link) === 'string') {
                links.push(link);
            }
        });
        if (links.length < 1) {
            throw 'Could not find problems.';
        }
        const random = Math.floor(Math.random() * links.length);
        const link = links[random];
        const problemCode = link.split('/')[2];
        return [problemCode, `https://www.codechef.com${link}`];
    }
    static async getSubmission(id) {
        const html = await node_fetch_1.default(`https://www.codechef.com/viewplaintext/${id}`).then(res => res.text());
        const $ = cheerio_1.default.load(html);
        const code = $('pre').text();
        return code;
    }
}
Codechef.colors = {
    1: '#666666',
    2: '#1E7D22',
    3: '#3366CB',
    4: '#684273',
    5: '#FFD819',
    6: '#FF7F00',
    7: '#C7011A'
};
Codechef.fetchRandomProblem();
module.exports = Codechef;
