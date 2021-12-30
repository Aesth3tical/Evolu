const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    	.setName('help')
    	.setDescription('Get help about the bot'),
    category: 'utility',
    async execute (client, interaction) {
        const helpMenu = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('help_menu')
                    .setPlaceholder('Click here to select a command category')
                    .addOptions([
                        { label: 'Economy', description: 'Economy commands', value: 'economy' },
                        { label: 'Utility', description: 'Utility commands', value: 'utility' }
                    ])
            )

        let helpEmbed = new MessageEmbed()
        	.setColor('BLURPLE')
        	.setDescription('Select a category from the menu below to view commands.')
        
        await interaction.reply({ embeds: [ helpEmbed ], components: [ helpMenu ] });
    }
};