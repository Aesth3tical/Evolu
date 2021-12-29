module.exports = {
    name: 'ready',
    trigger: 1,
    async execute (client) {
        console.log(`\n--------------------\n\nConnection to database complete, bot logged in.\n\nUsername: ${client.user.tag}\nID: ${client.user.id}\n\n--------------------`)
        client.user.setActivity(`For my slash (/) commands to be used`, { type: "LISTENING"})
        
        setInterval(() => {
            client.user.setActivity(`For my slash (/) commands to be used`, { type: "LISTENING" })
        }, 5000)
    }
}