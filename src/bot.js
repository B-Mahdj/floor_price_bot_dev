//Main entrypoint of our bot
//Call environment variables inside the .env file
require('dotenv').config();
MILLISECONDES_BEFORE_REFRESH=15000;
NUMBER_FOR_DIVIDE=1000000000;

//print dans la console la variable nommée dans .env 
//console.log(process.env.DISCORD_BOT_TOKEN);

//Import the Client class from the library 
const { Client, Intents } = require('discord.js');
const { cp } = require('fs');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const https = require('https');

//Log our bot in using the variable 
client.login(process.env.DISCORD_BOT_TOKEN)

//Loop each 15 seconds (variable for the 15 seconds)
var Interval=setInterval(getFloorPrice, MILLISECONDES_BEFORE_REFRESH);
var floor_price;
var avgPrice24h;

// Call the magicEden API to get details on the angrybearclub collection (var for the name)
function getFloorPrice(){
    var request = require('request');
    var options = {
      'method': 'GET',
      'url': 'http://api-mainnet.magiceden.dev/v2/collections/boryoku_dragonz/stats',
      'headers': {
      }
    };
    request(options, function (error, response, body) {
      if(error) console.log('error', err);
      var json = JSON.parse(body);
      console.log(json);
      //Get Floor price of the collection
      floor_price=json.floorPrice / NUMBER_FOR_DIVIDE;
      avgPrice24h=json.avgPrice24hr / NUMBER_FOR_DIVIDE;
      //Print it in console 
      console.log("The floor price returned is : ")
      console.log(floor_price);
      console.log("The avg price on 24h returned is : ")
      console.log(avgPrice24h);
      update_activity_status();
    });
}

//V2 : Print the floor price in profile description 
function update_activity_status(){
    console.log(`FP ${floor_price} SOL`);
    console.log(`Avg 24h : ${avgPrice24h} SOL`);
    client.user.setUsername(`FP ${floor_price} SOL`);
    client.user.setActivity(`Avg 24h : ${avgPrice24h} SOL`, { type: 'WATCHING' });
}