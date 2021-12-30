/*

This script works the menu used in the /help command, allowing the user to easily select a command category to view
while also providing all commands with descriptions included.

*/

module.exports = async function (interaction, category, MessageEmbed, client) {
    const commands = [];

    client.commands.forEach(command => {
        commands.push({
            name: command.data.name,
            category: command.category,
            description: command.data.description
        })
    })

    // Economy category menu builder
    if (category === "economy") {
        const econCmds = commands.filter(c => c.category === "economy");

        const cmdMap = econCmds.map(c => `__**${c.name[0].toUpperCase() + c.name.slice(1)}**__ - ${c.description[0].toUpperCase() + c.description.slice(1)}`).join('\n\n');

        return interaction.update({ embeds: [ MessageEmbed.setTitle('Economy Commands:').setColor('BLURPLE').setDescription(cmdMap) ] });
    
    // Utility category menu builder
    } else if (category === "utility") {
        const econCmds = commands.filter(c => c.category === "utility");

        const cmdMap = econCmds.map(c => `__**${c.name[0].toUpperCase() + c.name.slice(1)}**__ - ${c.description[0].toUpperCase() + c.description.slice(1)}`).join('\n\n');

        return interaction.update({ embeds: [ MessageEmbed.setTitle('Utility Commands:').setColor('BLURPLE').setDescription(cmdMap) ] });
    }
}