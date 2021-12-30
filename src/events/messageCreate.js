const Discord = require('discord.js');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { TOKEN, CLIENTID, GUILDID } = process.env;

module.exports = {
    name: 'messageCreate',
    trigger: 2,
    async execute (message, client) {
        if (message.content === '%loadslash') {
            if (process.env.OWNER !== message.author.id && message.author.id !== client.user.id) {
                const notAllowed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription('Only the bot owner is allowed to run text commands, as they are only used to load and reload the slash commands. Try those instead :smile:!')
                
                    return message.reply({ embeds: [ notAllowed ] })
            }

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