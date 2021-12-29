// Requirement Vars
require('dotenv').config();
const { Client, Intents, Collection } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { TOKEN, CLIENTID } = process.env;

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

// Setup Command/Event/Database Handlers
const commands = [];

fs.readdirSync(__dirname + `/commands`).forEach(folder => {
    fs.readdirSync(__dirname + `/commands/${folder}`).forEach(file => {
        const command = require(__dirname + `/commands/${folder}/${file}`);
        client.commands.set(command.data.name, command)
        commands.push(command.data.toJSON())
    })
})

const rest = new REST({ version: '9' }).setToken(TOKEN);

/*
(async () => {
    try {
        console.log('Registering application (/) commands...');
        
        await rest.put(
        	Routes.applicationCommands(CLIENTID),
            { body: commands }
        );
        
        console.log('Successfully registered application (/) commands!');
    } catch (err) {
        console.log(err);
    }
})();
*/

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