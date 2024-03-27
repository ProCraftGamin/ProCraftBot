const { Events, ActivityType } = require('discord.js');
const generalFunctions = require('../data/general functions.js');
const arcadeFunctions = require('../data/arcade functions.js');
const { liveCheck } = require('../data/twitch events.js');
const { deleteTickets } = require('../data/ticket functions.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setActivity('for /help', { type: ActivityType.Watching });
		arcadeFunctions.unscrambleGame(client);
		generalFunctions.cmdFunctions(client);
		setInterval(generalFunctions.checkRoles, 4.32e+7, client);
		setInterval(liveCheck, 30000, client);
		setInterval(deleteTickets, 8.64e+7, client);
		setInterval(arcadeFunctions.dailyStockUpdate, 8.64e+7, client);
		deleteTickets(client);
		liveCheck(client);
		arcadeFunctions.dailyStockUpdate(client);
		arcadeFunctions.getLastStreakWord(client);
	},
};