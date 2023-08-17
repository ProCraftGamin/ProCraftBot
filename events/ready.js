const { Events, ActivityType } = require('discord.js');
const generalFunctions = require('../data/general functions.js');
const twitchFunctions = require('../data/twitch events.js');
const { deleteTickets } = require('../data/ticket functions.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setActivity('for /help', { type: ActivityType.Watching });
		generalFunctions.unscrambleGame(client);
		generalFunctions.cmdFunctions(client);
		twitchFunctions.liveCheck(client);
		setInterval(generalFunctions.checkRoles, 43200000, client);
		setInterval(twitchFunctions.liveCheck, 30000, client);
		setInterval(deleteTickets, 8.64e+7, client);
		deleteTickets(client);
	},
};