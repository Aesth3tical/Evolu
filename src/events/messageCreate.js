/*

Handles TEXT messages, however only listens for users who are the bot owner in .env to run the %loadslash command,
which as the name suggests loads the slash commands.

*/

const Discord = require('discord.js');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { TOKEN, CLIENTID, GUILDID, OWNER, ADMIN_PREFIX } = process.env;

module.exports = {
    name: 'messageCreate',
    trigger: 2,
    async execute (message, client) {
        if (message.content === `${ADMIN_PREFIX}loadslash`) {
            
            // Checks if user running is the bot owner from .env
            if (OWNER !== message.author.id && message.author.id !== client.user.id) {
                const notAllowed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription('Only the bot owner is allowed to run text commands, as they are only used to load and reload the slash commands. Try those instead :smile:!')
                
                    return message.reply({ embeds: [ notAllowed ] })
            }


            // Handles registration of guild's commands with the Discord API
            const commands = [];

            fs.readdirSync(`src/commands`).forEach(folder => {
                fs.readdirSync(`src/commands/${folder}`).forEach(file => {
                    const command = require(`./../commands/${folder}/${file}`);
                    client.commands.set(command.data.name, command)
                    commands.push(command.data.toJSON())
                })
            })

            const rest = new REST({ version: '9' }).setToken(TOKEN);

            console.log(commands);

            (async () => {
                try {
                    console.log('Registering guild (/) commands...');
                    
                    await rest.put(
                        Routes.applicationGuildCommands(CLIENTID, GUILDID),
                        { body: commands }
                    );
                    
                    console.log('Successfully registered guild (/) commands!');
                } catch (err) {
                    console.log(err);
                }
            })();

            const success = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setDescription('Successfully loaded slash commands. Please give the Discord API up to a few minutes to fully load them.')
            
            message.reply({ embeds: [ success ] })
        }
    }
}