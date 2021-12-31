const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
    	.setName('buy')
    	.setDescription('Buy an item')
    	.addStringOption(option => option.setName('item_name').setDescription('Name of the item you wish to buy').setRequired(true))
	    .addIntegerOption(option => option.setName('amount').setDescription('How much of the item you wish to buy').setRequired(true)),
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
        
        if (!itemData) {
            const error = new Discord.MessageEmbed()
            	.setColor('RED')
            	.setDescription(`No item exists with the name ${itemName}.`)
            
            return interaction.editReply({ embeds: [ error ] })
        }
        
        if (userData.balance < (itemData.price * amount)) {
            const error = new Discord.MessageEmbed()
            	.setColor('RED')
            	.setDescription(`You need **$${(itemData.price * amount) - userData.balance}** more to be able to afford that.`)
            	.setFooter('Try out the /work and /crime commands to earn some money!')
            
            return interaction.editReply({ embeds: [ error ] })
        }
        
        let hasItem = await userData.inventory.find(i => i.name.toLowerCase() === itemData.name.toLowerCase());
        
        if (hasItem) {
            hasItem.amount += amount;
            userData.balance -= (itemData.price * amount);
            
            (await userData.markModified('inventory'), await userData.save());
            
            const success = new Discord.MessageEmbed()
            	.setColor('GREEN')
            	.setDescription(`Successfully purchased **${amount}** of \`\`${itemData.name}\`\`! You now have $${userData.balance.toLocaleString()}.`)
            
            return interaction.editReply({ embeds: [ success ] })
        } else if (!hasItem) {
            let itemObj = {
                name: itemData.name,
                description: itemData.description,
                amount: amount
            };
            
            await userData.inventory.push(itemObj);
            userData.balance -= (itemData.price * amount);
            
            (await userData.markModified('inventory'), await userData.save());
            
            const success = new Discord.MessageEmbed()
            	.setColor('GREEN')
            	.setDescription(`Successfully purchased **${amount}** of \`\`${itemData.name}\`\`! You now have $${userData.balance.toLocaleString()}.`)
            
            return interaction.editReply({ embeds: [ success ] })
        }
    }
};