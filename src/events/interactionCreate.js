/*

This is the main script which runs the bot, since it acts as the command handler which listens for slash commands
and other interactions (i.e, selections on the help menu).

*/

const Discord = require('discord.js');
const mongoose = require('mongoose');
const helpMenu = require('./../functions/utility/helpMenu.js');

module.exports = {
    name: 'interactionCreate',
    trigger: 2,
    async execute (interaction, client) {
        if (!interaction.member.guild) return;
        
        // Checks if the interaction is a slash command
        if (interaction.isCommand()) {
            let u = mongoose.model("User");
            let us = await u.findOne({ _id: interaction.user.id }) || await new u({ _id: interaction.user.id })

            let commandName = interaction.commandName
            const command = client.commands.get(commandName);
            if (!command) return;
            
            const now = Date.now();
            const cooldownAmount = Math.floor(command.cooldown) * 60000;

            if (command.cooldown) {
                let cd = us.cooldowns.find(c => c.command === command.name);

                if (!cd) {
                    let cdObj = { command: command.name, cooldown: 0 }
                    await us.cooldowns.push(cdObj)
                    await us.save()
                    us = await u.findOne({ _id: interaction.user.id }) || await new u({ _id: interaction.user.id })
                    cd = us.cooldowms.find(c => c.command === command.name)
                }

                if (cd.cooldown !== 0) {
                    const expirationTime = cd.cooldown + cooldownAmount;

                    if (now < expirationTime) {
                        const timeLeft = (expirationTime - now) / 60000;
                        const time = timeLeft.toFixed();

                        const cooldownEmbed = new Discord.MessageEmbed()
                            .setColor('#ff0000')
                            .setDescription(`You must wait ${time} ${time > 1 || time === 0 ? 'minutes' : 'minute'} before using that command again!`)
                        return interaction.reply({ embeds: [ cooldownEmbed ], ephemeral: true })
                    }
                }

                cd.cooldown = now;
                (us.markModified("cooldowns"), (await us.save()))

                setTimeout(async () => {
                    cd.cooldown = 0;
                    (us.markModified("cooldowns"), (await us.save()));
                }, cooldownAmount);
            }

            command.execute(client, interaction);

        // Checks if the interaction is apart of the help menu
        } else if (interaction.isSelectMenu()) {
            if (interaction.customId === 'help_menu') {
                helpMenu(interaction, interaction.values[0], new Discord.MessageEmbed(), client)
            }
        }
    }
}