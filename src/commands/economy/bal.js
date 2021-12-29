const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
    	.setName('bal')
    	.setDescription('View your balance'),
    async execute (client, interaction) {
        await interaction.deferReply();
        
        const user = mongoose.model('User');
        const userData = await user.findOne({ _id: interaction.user.id }) || await new user({ _id: interaction.user.id });
        
        let balance = new Discord.MessageEmbed()
        	.setColor('BLURPLE')
        	.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png', dynamic: true }) })
        	.setDescription(`Your Balance: $${userData.balance.toLocaleString()}.`)
        
        return interaction.editReply({ embeds: [ balance ] });
    }
};