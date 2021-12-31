const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
    	.setName('bal')
    	.setDescription('View your balance')
        .addUserOption(option => option.setName('user').setDescription('User you wish to see the balance of (optional)').setRequired(false)),
    category: 'economy',
    async execute (client, interaction) {
        await interaction.deferReply();
        
        let otherUser = interaction.options.getUser('user');

        const user = mongoose.model('User');
        let userData;
        let userInfo;

        if (otherUser) {
            userData = await user.findOne({ _id: otherUser.id }) || await new user({ _id: otherUser.id });
            userInfo = otherUser;
        } else {
            userData = await user.findOne({ _id: interaction.user.id }) || await new user({ _id: interaction.user.id });
            userInfo = interaction.user;
        }

        let balance = new Discord.MessageEmbed()
        	.setColor('BLURPLE')
        	.setAuthor({ name: userInfo.tag, iconURL: userInfo.displayAvatarURL({ format: 'png', dynamic: true }) })
        	.setDescription(`${userInfo.username}'s balance: $${userData.balance.toLocaleString()}.`)
        
        return interaction.editReply({ embeds: [ balance ] });
    }
};