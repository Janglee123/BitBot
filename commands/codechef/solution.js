const web = require('./scrape/scrap.js');
const Discord = require('discord.js');

exports.run = (client,message,args) => {
    //in work
    web.getUser(args, user => {
        if(!user){
            message.channel.send("User doesn't exists");
            return;
        }
        let embed = new Discord.RichEmbed();
        embed.addField("Problem link",user.problem)
            .addField("Contest link",user.contest)
            .addField("Profile link",user.profile);
        // message.channel.send(embed);
    });
    //calls getSub function to get solution as plaintext and format it here
    web.getSub(args,text => {
        if(!text){
            message.channel.send("Solution not available");
            return;
        }    
        // let embed = new Discord.RichEmbed();
        text = "```"+text+"```"; //add backticks for formatting
        message.channel.send(`${message.author.username}'s Solution :`+text);
    });
    
}

exports.info = "Print solution as a text message\n!codechef solution 'solution-id'";