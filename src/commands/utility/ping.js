const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    	.setName('ping')
    	.setDescription('Ping the bot server'),
    cooldown: 1,
    category: 'utility',
    async execute (client, interaction) {
        let pingEmbed = new Discord.MessageEmbed()
        	.setColor('GREEN')
        	.setDescription(`WS Ping: \`\`${client.ws.ping}ms\`\`.`)
        
        interaction.reply({ embeds: [ pingEmbed ] });
    }
};