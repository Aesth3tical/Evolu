const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js');
const mongoose = require('mongoose');
const random = require('./../../functions/economy/random.js');

module.exports = {
    data: new SlashCommandBuilder()
    	.setName('work')
    	.setDescription('Work for income'),
    // cooldown: 5,
    category: 'economy',
    async execute (client, interaction) {
        await interaction.deferReply();
        
        const user = mongoose.model('User');
        const userData = await user.findOne({ _id: interaction.user.id }) || await new user({ _id: interaction.user.id });
        
        let income = Math.ceil(Math.random() * 100);
        let newBal = userData.balance + income;
        userData.balance = newBal;
        await userData.save();
        
        let chooseTask = await random.work();
        
        let work = new Discord.MessageEmbed()
        	.setColor('BLURPLE')
        	.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ format: 'png', dynamic: true }) })
        	.setDescription(`${chooseTask} $${income}. Your new balance is $${userData.balance.toLocaleString()}`)
        
        await interaction.editReply({ embeds: [ work ] });
    }
};