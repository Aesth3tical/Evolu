// Requirement Vars
require('dotenv').config();
const { Client, Intents, Collection } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { TOKEN } = process.env;

// Initiate Client
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_MESSAGES,
    ]
});

// Setup Client Vars
client.cooldowns = new Collection();
client.commands = new Map();
client.prefix = '%'

// Setup Event/Database Handlers
const ef = fs.readdirSync(__dirname + '/events').filter(file => file.endsWith('.js'));
console.log(ef)

for (const file of ef) {
	const event = require(`./events/${file}`);
	if (event.trigger === 1) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else if (event.trigger === 2) {
		client.on(event.name, (...args) => event.execute(...args, client));
    }
}

let modelPath = path.join(__dirname, "/schemas");
fs.readdirSync(modelPath, { withFileTypes: true }).forEach((file) => {
  if (file.isFile())
    console.log(`loaded model for collection ${require(path.join(modelPath, file.name)).collection.name}`);
});

// Setup MongoDB Connection and Login Bot
const mongo = require('./mongo.js');

async function mongoConnect() {
    await mongo().then(async () => {
        console.log('Connected to Mongo!')
    })
}

mongoConnect().then(client.login(TOKEN))