const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
    	.setName('item')
    	.setDescription('Item management - see subcommands')
    	.addSubcommand(command =>
            command.setName('create').setDescription('Create an item')
            	.addStringOption(option => option.setName('name').setDescription('Item name').setRequired(true))
            	.addIntegerOption(option => option.setName('price').setDescription('Item price').setRequired(true))
            	.addStringOption(option => option.setName('description').setDescription('Item description').setRequired(true))
        )
    	.addSubcommand(command =>
            command.setName('delete').setDescription('Delete an item')
            	.addStringOption(option => option.setName('name').setDescription('Item name').setRequired(true))
        )
    	.addSubcommand(command =>
            command.setName('edit').setDescription('Edit an item')
            	.addStringOption(option => option.setName('name').setDescription('Item name').setRequired(true))
            	.addStringOption(option => option.setName('new_name').setDescription('New item name').setRequired(true))
            	.addIntegerOption(option => option.setName('price').setDescription('New item price').setRequired(true))
            	.addStringOption(option => option.setName('description').setDescription('New item description').setRequired(true))
        )
    	.addSubcommand(command =>
            command.setName('view').setDescription('View an item')
            	.addStringOption(option => option.setName('name').setDescription('Item name. Leaving this field blank will show all items').setRequired(false))
        ),
    async execute (client, interaction) {
        await interaction.deferReply();
        
        const guild = mongoose.model('Guild');
        const guildData = await guild.findOne({ _id: interaction.guild.id }) || await new guild({ _id: interaction.guild.id });
        
        let isManager = interaction.member.roles.cache.some(r => r.id === guildData.managerRole);
        
        let option = interaction.options.getSubcommand();
        
        if (option === "create") {
            if (!isManager) {
                const error = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription('Only members with the manager role can create, delete and edit items.')
                	.setFooter('Have the server owner run /setmanager <roleID> to set a manager role if they haven\'t already.')

                return interaction.editReply({ embeds: [ error] });
        	}
            
            let itemName = interaction.options.getString('name');
            let itemPrice = interaction.options.getInteger('price');
            let itemDesc = interaction.options.getString('description');
            
            let itemObj = {
                name: itemName,
                price: itemPrice,
                description: itemDesc
            };
            
            console.log(itemObj)
            
            let itemData = await guildData.items.find(i => i.name.toLowerCase() === itemName.toLowerCase());
            
            if (itemData) {
                const error = new Discord.MessageEmbed()
                	.setColor('RED')
                	.setDescription('An item with that name already exists!')
                
                return interaction.editReply({ embeds: [ error ] })
            }

            await guildData.items.push(itemObj);
            (await guildData.markModified('items'), await guildData.save());
            
            itemData = await guildData.items.find(i => i.name.toLowerCase() === itemName.toLowerCase())
            
            console.log(itemData)
            
            const success = new Discord.MessageEmbed()
            	.setColor('GREEN')
            	.setDescription('Successfully created item!')
            	.addFields(
                	{ name: 'Item Name', value: itemData.name[0].toUpperCase() + itemData.name.slice(1), inline: false },
                    { name: 'Price', value: itemData.price.toLocaleString(), inline: false },
                    { name: 'Item Description', value: itemData.description[0].toUpperCase() + itemData.name.slice(1), inline: false }
                )
            
            return interaction.editReply({ embeds: [ success ] });
        } else if (option === 'delete') {
            if (!isManager) {
                const error = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription('Only members with the manager role can create, delete and edit items.')

                return interaction.editReply({ embeds: [ error] });
        	}
            
            let itemName = interaction.options.getString('name');
            
            let itemData = await guildData.items.find(i => i.name.toLowerCase() === itemName.toLowerCase());
            
            if (!itemData) {
                const error = new Discord.MessageEmbed()
                	.setColor('RED')
                	.setDescription(`No item was found with the name ${itemName}.`)
                
                return interaction.editReply({ embeds: [ error ] });
            }
            
            await guildData.items.pull(itemData);
            (await guildData.markModified('items'), await guildData.save());
            
            const success = new Discord.MessageEmbed()
            	.setColor('GREEN')
            	.setDescription(`${itemName} successfully deleted.`)
            
            return interaction.editReply({ embeds: [ success ] });
        } else if (option === "edit") {
            if (!isManager) {
                const error = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription('Only members with the manager role can create, delete and edit items.')

                return interaction.editReply({ embeds: [ error] });
        	}
            
            let itemName = interaction.options.getString('name');
            let newName = interaction.options.getString('new_name');
            let newPrice = interaction.options.getInteger('price');
            let newDesc = interaction.options.getString('description');
            
            let itemData = await guildData.items.find(i => i.name.toLowerCase() === itemName.toLowerCase());
            
            if (!itemData) {
                const error = new Discord.MessageEmbed()
                	.setColor('RED')
                	.setDescription(`No item was found with the name ${itemName}.`)
                
                return interaction.editReply({ embeds: [ error ] });
            }
            
            await guildData.items.pull(itemData);
            
            let itemObj = {
                name: newName,
                price: newPrice,
                description: newDesc
            }
            
            await guildData.items.push(itemObj);
            
            (await guildData.markModified('items'), await guildData.save());
            
            itemData = await guildData.items.find(i => i.name.toLowerCase() === newName.toLowerCase());
            
            const success = new Discord.MessageEmbed()
            	.setColor('GREEN')
            	.setDescription('Successfully edited item!')
            	.addFields(
                	{ name: 'Item Name', value: itemData.name[0].toUpperCase() + itemData.name.slice(1), inline: false },
                    { name: 'Price', value: itemData.price.toLocaleString(), inline: false },
                    { name: 'Item Description', value: itemData.description[0].toUpperCase() + itemData.description.slice(1), inline: false }
                )
            
            return interaction.editReply({ embeds: [ success ] });
        } else if (option === "view") {
            if (interaction.options.getString('name')) {
                let itemName = interaction.options.getString('name');
                
                let itemData = await guildData.items.find(i => i.name.toLowerCase() === itemName.toLowerCase());
                
                if (!itemData) {
                    const error = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setDescription(`No item was found with the name ${itemName}.`)

                    return interaction.editReply({ embeds: [ error ] });
            	}
                
                const itemInfo = new Discord.MessageEmbed()
                	.setColor('GREEN')
                	.addFields(
                    	{ name: 'Item Name', value: itemData.name[0].toUpperCase() + itemData.name.slice(1), inline: false },
                        { name: 'Item Price', value: itemData.price.toLocaleString(), inline: false },
                        { name: 'Item Description', value: itemData.description[0].toUpperCase() + itemData.description.slice(1), inline: false }
                    )
                	.setFooter(`Use /item buy ${itemName} to buy this item.`)
                
                return interaction.editReply({ embeds: [ itemInfo ] })
            }
            
            let items = await guildData.items.map(i => `**${i.name[0].toUpperCase() + i.name.slice(1).toLowerCase()} - ${i.price}**\n> ${i.description[0].toUpperCase() + i.description.slice(1)}`).join('\n\n');
            
            const itemEmbed = new Discord.MessageEmbed()
            	.setColor('GREEN')
            	.setTitle(`${interaction.member.guild.name}'s items`)
                .setThumbnail(interaction.member.guild.iconURL({ format: 'png', dynamic: true }))
            	.setDescription(items)
            	.setFooter('Use /item view <item_name> to view individual items.')
            
            return interaction.editReply({ embeds: [ itemEmbed ] });
        }
    }
};