/* eslint-disable brace-style */
// Require discord.js classes and token
const chalk = require('chalk');
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildBans, GatewayIntentBits.DirectMessages], partials: [Partials.Channel, Partials.Message] });

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	console.log(chalk.dim(`Found ${file}`));
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath).forEach((category) => {
	const commandFiles = fs.readdirSync(`${commandsPath}/${category}/`).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, category, file);
		const command = require(filePath);

		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
});


client.login(token);
// bot testing: 1047723477563609168