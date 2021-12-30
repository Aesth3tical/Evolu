const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
    	.setName('setmanager')
    	.setDescription('Set your guilds\' manager role')
        .addRoleOption(option => option.setName('role').setDescription('Role to set as manager role').setRequired(true)),
    category: 'utility',
    async execute (client, interaction) {
        await interaction.deferReply();
        
        const guild = mongoose.model('Guild');
        const guildData = await guild.findOne({ _id: interaction.guild.id }) || await new guild({ _id: interaction.guild.id });
        
        if (interaction.user.id !== interaction.guild.ownerId) {
            const error = new Discord.MessageEmbed()
            	.setColor('RED')
            	.setDescription('Only the server owner can set the manager role.')
            
            return interaction.editReply({ embeds: [ error] });
        }
        
        const roleID = interaction.options.getRole('role').id;
        const role = interaction.member.guild.roles.cache.get(roleID);
        
        if (!role) {
            const error = new Discord.MessageEmbed()
            	.setColor('RED')
            	.setDescription('The provided role does not exist.')
            
            return interaction.editReply({ embeds: [ error ] });
        }
        
        guildData.managerRole = role.id;
        await guildData.save();
        
        const success = new Discord.MessageEmbed()
        	.setColor('GREEN')
        	.setDescription(`Successfully set the guild economy manager role as <@&${guildData.managerRole}>!`)
        
        return interaction.editReply({ embeds: [ success ] });
    }
};