const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
    	.setName('sell')
    	.setDescription('Sell an item')
    	.addStringOption(option => option.setName('item_name').setDescription('Name of the item you wish to sell').setRequired(true))
	    .addIntegerOption(option => option.setName('amount').setDescription('How much of the item you wish to sell').setRequired(true)),
    category: 'economy',
    async execute (client, interaction) {
        await interaction.deferReply();
        
        const user = mongoose.model('User');
        const guild = mongoose.model('Guild')
        const userData = await user.findOne({ _id: interaction.user.id }) || await new user({ _id: interaction.user.id });
        const guildData = await guild.findOne({ _id: interaction.member.guild.id }) || await new guild({ _id: interaction.member.guild.id });
        
        let itemName = interaction.options.getString('item_name');
        let amount = interaction.options.getInteger('amount');
        
        let itemData = await guildData.items.find(i => i.name.toLowerCase() === itemName.toLowerCase());
        
        let hasItem = await userData.inventory.find(i => i.name.toLowerCase() === itemData.name.toLowerCase());
        
        if (hasItem) {
            if (hasItem.amount < amount) {
                const notEnough = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription('You do not have enough of that item to sell that many.')
                
                return interaction.editReply({ embeds: [ notEnough ] })
            };

            if (hasItem.amount - amount !== 0) {
                hasItem.amount -= amount;
                userData.balance += (itemData.price * amount);
            } else if (hasItem.amount - amount === 0) {
                await userData.inventory.pull(hasItem);
                userData.balance += (itemData.price * amount);
            }
            
            (await userData.markModified('inventory'), await userData.save());
            
            const success = new Discord.MessageEmbed()
            	.setColor('GREEN')
            	.setDescription(`Successfully sold **${amount}** of \`\`${itemData.name}\`\`! You now have $${userData.balance.toLocaleString()}.`)
            
            return interaction.editReply({ embeds: [ success ] })
        } else if (!hasItem) {
            const notInInv = new Discord.MessageEmbed()
            	.setColor('RED')
            	.setDescription(`You don't have that item in your inventory.`)
            
            return interaction.editReply({ embeds: [ notInInv ] })
        }
    }
};