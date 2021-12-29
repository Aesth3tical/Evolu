const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    	.setName('test')
    	.setDescription('Testing command'),
    cooldown: 1,
    async execute (client, interaction) {
        if (interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            return interaction.reply({ content: 'Permission check success', ephemeral: true })
        } else return interaction.reply({ content: 'Invalid permissions', ephemeral: true })
    }
};