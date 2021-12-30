const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
    	.setName('inv')
    	.setDescription('View your balance')
    	.addUserOption(option => option.setName('user').setDescription('User you wish to see the inventory of (optional)').setRequired(false)),
    category: 'economy',
    async execute (client, interaction) {
        await interaction.deferReply();
        
        let otherUser = interaction.options.getUser('user');

        const user = mongoose.model('User');
        let userData;

        if (otherUser) {
            userData = await user.findOne({ _id: otherUser.id }) || await new user({ _id: otherUser.id });
        } else userData = await user.findOne({ _id: interaction.user.id }) || await new user({ _id: interaction.user.id });

        if (userData.inventory.length === 0) {
            const error = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription('The given user has nothing in their inventory.')
            
            return interaction.editReply({ embeds: [ error ] });
        }

        let inventory = userData.inventory.map(i => `**${i.name[0].toUpperCase() + i.name.slice(1).toLowerCase()} - ${i.amount}**\n> ${i.description[0].toUpperCase() + i.description.slice(1)}`).join('\n');

        let inv = new Discord.MessageEmbed()
        	.setColor('BLURPLE')
        	.setTitle(`${otherUser ? otherUser.username : interaction.user.username}'s inventory`)
            .setThumbnail(`${otherUser ? otherUser.displayAvatarURL({ format: 'png', dynamic: true }) : interaction.user.displayAvatarURL({ format: 'png', dynamic: true })}`)
        	.setDescription(inventory)
        
        return interaction.editReply({ embeds: [ inv ] });
    }
};