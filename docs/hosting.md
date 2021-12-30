# Setup Instructions:
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