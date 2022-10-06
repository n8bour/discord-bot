const { Client, Intents } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const https = require('https');
const axios = require('axios').default;
const keepAlive = require("./server")

let guildMeCache = [];
const URL = "https://api.dexscreener.io/latest/dex/pairs/avalanche/0x218E154Dc5EF516dBCd352EA8d4a2dCE10d11669";

keepAlive()
// Ready up activities
bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
    bot.user.setActivity(`😀`);

    bot.guilds.cache.each(guild => guildMeCache.push(guild.me));

    UPDATE_INTERVAL = 60000; //1min

    getPrice();
    setInterval(getPrice, UPDATE_INTERVAL);
})


// New server join event that causes the guild cache to refresh
bot.on('guildCreate', guild => {
    bot.guilds.cache.each(guild => guildMeCache.push(guild.me));
    console.log(`New server has added the bot! Name: ${guild.name}`);
});

bot.login(process.env['TOKEN']);

function getPrice() {
    //https://docs.dexscreener.com/#undefined
    let json = {};

    axios.get(url)
        .then(function (res) {
            if (res.data) {
                console.log('Retrieved all data');
                //console.log(data);
                json = res.data["pair"];
                console.log(json);
                guildMeCache.forEach(guildMe =>                 guildMe.setNickname(`${json["baseToken"]['symbol']}: ${json["priceUsd"]}$ `));
                bot.user.setActivity(`24h: ${json["priceChange"]['h24']}}%`, {type: "WATCHING"});
            }

        }).catch(function (err) {
        console.error(`Encountered an error trying to make a request: ${err.message}`);
    })
}