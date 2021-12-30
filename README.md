# EvoluBot

Hey there! :wave:

This is a project I made for Advertise Your Bot's 2021 Hackathon. Out of the categories, I decided to go with Bot -> Economy, and decided to learn slash commands throughout the project. Prior to this, I hadn't actually used slash commands before so it was quite fun to learn while competing :smile:.

### **Note:** This bot is intended for use in one (1) guild.

## About the bot/libraries
EvoluBot is a fully functional economy bot which uses slash commands to avoid parsing issues and unnecessary type determination code which would be necessary when using text commands for the purposes it serves. It runs on the [discord.js](https://github.com/discordjs/discord.js) **v13.4.0** library, as well as various other third party libraries aside from built-in node.js libraries such as [discord.js builders](https://github.com/discordjs/builders) and [dotenv](https://github.com/motdotla/dotenv). A full list of dependencies is below -
> - [discord.js](https://github.com/discordjs/discord.js)
> - [@discordjs/rest](https://github.com/discordjs/discord.js-modules/tree/main/packages/rest)
> - [discord-api-types](https://github.com/discordjs/discord-api-types)
> - [mongoose](https://github.com/Automattic/mongoose)
> - [fs](https://nodejs.org/api/fs.html)
> - [dotenv](https://github.com/motdotla/dotenv)
> - [path](https://github.com/jinder/path)

## Commands
EvoluBot's commands are listed below, though please note that the only text command, (``<adminprefix>loadslash``) is not listed due to limited use. Subcommands are also listed, on their individual commands. ``[]`` denotes an optional field, ``<>`` denotes a required field.

**Economy:**
> - bal [user]
> - buy <amount> <item>
> - crime
> - inv [user]
> - item
>> - item Create <name> <price> [description]
>> - item Delete <name>
>> - item Edit <name> <new_name> <new_price> [new_description]
>> - item View [name]
> - work

**Utility:**
> - help [command]
> - ping
> - setmanager <role>

## Setup Instructions:
For instructions on how to get started with hosting the bot, see below -

1. Install prerequisite software if you do not already have it -
    * [Node.js](https://nodejs.org/)
    * [Git](https://git-scm.com/)
2. Clone this repository - ``git clone https://github.com/Aesth3tical/AYB-Hackathon-2021``
3. Make a copy of ``.env.example`` file in your bot workspace, taking off the ``.example`` portion and fill it in
    * *Note that the ``ADMIN_PREFIX`` variable is the prefix which would be used to initialize the bot's slash commands for use. No other general commands on the bot use text, so only the user with their ID set as the ``OWNER`` env variable will be able to load slash commands.*
4. Don't forget to save before continuing!
5. Open a console/terminal and run ``npm run build``, followed by ``npm run start`` when that's done.
6. If the output looks similar to the screenshot below, your bot should be responsive!
    * ![Screenshot](./misc/README_image.png)