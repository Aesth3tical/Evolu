# EvoluBot

Hey there! :wave:

This is a project I made for Advertise Your Bot's 2021 Hackathon. Out of the categories, I decided to go with Bot -> Economy, and decided to learn slash commands throughout the project. Prior to this, I hadn't actually used slash commands before so it was quite fun to learn while competing :smile:.

### **Note:** This bot is intended for use in one (1) guild.

## About the bot/libraries:
EvoluBot is a fully functional economy bot which uses slash commands to avoid parsing issues and unnecessary type determination code which would be necessary when using text commands for the purposes it serves. It runs on the [discord.js](https://github.com/discordjs/discord.js) **v13.4.0** library, as well as various other third party libraries aside from built-in node.js libraries such as [discord.js builders](https://github.com/discordjs/builders) and [dotenv](https://github.com/motdotla/dotenv). A full list of dependencies is below. **Note that the bot requires the SERVER_MEMBERS privileged intent to function** -
> - [discord.js](https://github.com/discordjs/discord.js) | main runner of the bot, handles connection to the Discord API and runs the event handler
> - [@discordjs/rest](https://github.com/discordjs/discord.js-modules/tree/main/packages/rest) | handles the registration of slash commands alongside discord-api-types
> - [discord-api-types](https://github.com/discordjs/discord-api-types) | see @discordjs/rest
> - [mongoose](https://github.com/Automattic/mongoose) | handles mongodb databasing for the bot
> - [fs](https://nodejs.org/api/fs.html) | main component of file location for command and event handlers
> - [dotenv](https://github.com/motdotla/dotenv) | loads in .env variables into the process' environment for use by the bot
> - [path](https://github.com/jinder/path) | handles the loading of database schemas

The bot's code was built and runs without issue on **Node.js v17.3.0**, though is supported through a minimum of Node.js v16.

## Docs:
> * [⚒️ Commands](./docs/commands.md)
> * [🖥️ Hosting/Setup](./docs/hosting.md)

## Team Members:
> - 𝑨𝒆𝒔𝒕𝒉𝒆𝒕𝒊𝒄𝒂𝒍.#1000 (559200051629654026)
