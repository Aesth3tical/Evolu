const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
    	.setName('give')
    	.setDescription('Give another user money')
    	.addUserOption(option => option.setName('user').setDescription('User you wish to give the money to').setRequired(true))
	    .addIntegerOption(option => option.setName('amount').setDescription('Amount you wish to give to the user').setRequired(true)),
    category: 'economy',
    async execute (client, interaction) {
        await interaction.deferReply();
        
        const user = mongoose.model('User');

        let getUser = interaction.options.getUser('user')
        let amount = interaction.options.getInteger('amount')


        const fromData = await user.findOne({ _id: interaction.user.id }) || await new user({ _id: interaction.user.id });
        const toData = await user.findOne({ _id: getUser.id }) || await new user({ _id: getUser.id });

        if (fromData.balance < amount) {
            const error = new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription(`You don't have that much money to give! Your balance - $${fromData.balance.toLocaleString()}.`);
        
            return interaction.editReply({ embeds: [ error ] })
        }

        fromData.balance -= amount;
        toData.balance += amount;

        await fromData.save();
        await toData.save();

        const success = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription(`Successfully gave ${toData} $${amount.toLocalestring()}. You now have $${fromData.balance.toLocalestring()}, and they now have $${toData.balance.toLocalestring()}`);
        
        return interaction.editReply({ embeds: [ success ] })
    }
};