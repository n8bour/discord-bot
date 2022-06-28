const Discord = require('discord.js');
const {Client, Intents} = require('discord.js');
const bot = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
//const https = require('https');
const axios = require('axios').default;


let UPDATE_INTERVAL;  // Price update interval in milliseconds
let TICKER;           // Which ticker to pull price for
let TOKEN_INDEX;      // Discord bot token index to use (in auth.json)
let ROTATE_PRICE;     // If unpopulated, keep price as $, otherwise rotate between $, Ξ and ₿ every 10 seconds

let priceData;
let guildMeCache = [];

// Ready up activities
bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
    bot.user.setActivity(`😀`);

    bot.guilds.cache.each(guild => guildMeCache.push(guild.me));
    //guildMeCache.forEach(guildMe => guildMe.setNickname(`${priceData.ticker} ${showPriceType}${priceData[priceKey].currPrice} ${priceData[priceKey].changeArrow}`));
    UPDATE_INTERVAL = 300000; //5min
    //UPDATE_INTERVAL = 3000;
    getPrice();
    setInterval(getPrice, UPDATE_INTERVAL);
})


// New server join event that causes the guild cache to refresh
bot.on('guildCreate', guild => {
    bot.guilds.cache.each(guild => guildMeCache.push(guild.me));
    console.log(`New server has added the bot! Name: ${guild.name}`);
});

bot.login('OTMxMjU5OTM5OTUzOTk5ODky.YeB1Zw.zK2yitU4qecwmLdHyVDFoCaDhCE');

function getPrice() {
    //https://docs.dexscreener.com/#undefined
    let url = "https://api.dexscreener.io/latest/dex/pairs/avalanche/0x218E154Dc5EF516dBCd352EA8d4a2dCE10d11669";
    let json = {};
    /*  let request = https.get(url, (res) => {
          if (res.statusCode !== 200) {
              console.error(`Did not get an OK from the server. Code: ${res.statusCode}`);
              res.resume();
             return;
          } else {
              let data = '';

              res.on('data', (chunk) => {
                  data += chunk;
              });
          }


          res.on('end', () => {
              console.log('Retrieved all data');
              json = JSON.parse(data)["pair"];
              console.log(json);
              guildMeCache.forEach(guildMe => guildMe.setNickname(`${json["baseToken"]['symbol']}: ${json["priceUsd"]}$ `));
              bot.user.setActivity(`24h: ${json["priceChange"]['h24']}}%`, {type: "WATCHING"});
          });
      })*/

    axios.get(url)
        .then(function (res) {
            //console.log(res);
            /*    let data = '';
                data += res.data;*/

            if (res.data) {
                console.log('Retrieved all data');
                //console.log(data);
                json = res.data["pair"];
                console.log(json);
                guildMeCache.forEach(guildMe => guildMe.setNickname(`${json["baseToken"]['symbol']}: ${json["priceUsd"]}$ `));
                bot.user.setActivity(`24h: ${json["priceChange"]['h24']}}%`, {type: "WATCHING"});
            }

        }).catch(function (err) {
        console.error(`Encountered an error trying to make a request: ${err.message}`);
    })
}