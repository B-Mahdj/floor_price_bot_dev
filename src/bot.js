//Main entrypoint of our bot
//Call environment variables inside the .env file
require('dotenv').config();
MILLISECONDES_BEFORE_REFRESH=15000;
NUMBER_FOR_DIVIDE=1000000000;
NUMBER_OF_NFT_IN_COLLECTION=10000;

//print dans la console la variable nommée dans .env 
//console.log(process.env.DISCORD_BOT_TOKEN);

//Import the Client class from the library 
const Discord = require('discord.js');
const { cp } = require('fs');

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS] });

client.on('ready', async () => {
  const GUILD_ID = client.guilds.cache.map(guild => guild.id);
  const guild = await client.guilds.fetch(GUILD_ID[0]);
  const https = require('https');
  console.log('Bot is connected...');
  var floor_price,avgPrice24h, listedCount, volumeAll, percentage_listed;

  setInterval(async function(){
    // Call the magicEden API to get details on the angrybearclub collection (var for the name)
    var request = require('request');
    var options = {
      'method': 'GET',
      'url': 'http://api-mainnet.magiceden.dev/v2/collections/astrals/stats',
      'headers': {
      }
    };
    request(options, function (error, response, body) {
      if(error) console.log('error', err);
      var json = JSON.parse(body);
      console.log(json);
      //Get Floor price of the collection
      floor_price=json.floorPrice / NUMBER_FOR_DIVIDE;
      avgPrice24h=floatParse2(json.avgPrice24hr / NUMBER_FOR_DIVIDE);
      listedCount=json.listedCount;
      volumeAll=floatParse2(json.volumeAll / NUMBER_FOR_DIVIDE);
      percentage_listed= floatParse2((listedCount / NUMBER_OF_NFT_IN_COLLECTION) * 100);

      //Print it in console 
      console.log("The floor price returned is : ")
      console.log(floor_price);
      console.log("The avg price on 24h returned is : ")
      console.log(avgPrice24h);
      console.log("The number of listed NFT is : ")
      console.log(listedCount);
      console.log("The volume for All time is : ")
      console.log(volumeAll);
    });

    //V2 : Print the floor price in profile description 
    const nickname = `FP\: ${floor_price} SOL`;
    console.log(nickname);
    console.log(`Avg 24h : ${avgPrice24h} SOL`);
    guild.me.setNickname(nickname);
    client.user.setActivity(`Avg 24h: ${avgPrice24h} SOL/${listedCount} listed (${percentage_listed}%)/ VolumeALL : ${volumeAll}`, { type: 'WATCHING' });
  }, MILLISECONDES_BEFORE_REFRESH)

});

function floatParse2(x) {
  return Number.parseFloat(x).toFixed(2);
}

//Log our bot in using the variable 
client.login(process.env.DISCORD_BOT_TOKEN);
