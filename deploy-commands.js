const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');
const fs = require('node:fs');

const commands = [];
// Fetch command files from commands directory
fs.readdirSync('./commands/').forEach((category) => {
	const commandFiles = fs.readdirSync(`./commands/${category}/`).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const command = require(`./commands/${category}/${file}`);
		commands.push(command.data.toJSON());
		console.log(`Found ${file}.`);
	}


});
// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Attempting to send ${commands.length} application (/) commands to discord...`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully sent ${data.length} application (/) commands to discord.`);
	} catch (error) {
	// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();