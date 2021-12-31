const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
    	.setName('addmoney')
    	.setDescription('Add money to a user')
    	.addUserOption(option => option.setName('user').setDescription('User you wish to add the money to').setRequired(true))
	    .addIntegerOption(option => option.setName('amount').setDescription('Amount you wish to add to the user').setRequired(true)),
    category: 'economy',
    async execute (client, interaction) {
        await interaction.deferReply();
        
        const user = mongoose.model('User');
        const guild = mongoose.model('Guild');
        const guildData = await guild.findOne({ _id: interaction.member.guild.id }) || await new guild({ _id: interaction.member.guild.id });
        
        let isManager = interaction.member.roles.cache.some(r => r.id === guildData.managerRole);
        
        if (!isManager) {
            const error = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription('Only members with the manager role can add and remove money from users.')
                .setFooter('Have the server owner run /setmanager <roleID> to set a manager role if they haven\'t already.')

            return interaction.editReply({ embeds: [ error] });
        }

        let getUser = interaction.options.getUser('user')
        let amount = interaction.options.getInteger('amount')

        const userData = await user.findOne({ _id: getUser.id }) || await new user({ _id: getUser.id });

        userData.balance += amount;

        await userData.save();

        const success = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription(`Successfully added $${amount} to ${getUser}'s balance. They now have $${userData.balance.toLocaleString()}.`);
        
        return interaction.editReply({ embeds: [ success ] })
    }
};