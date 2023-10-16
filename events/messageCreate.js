const { streakChannel } = require('../config.json');
const { updateStreak } = require('../data/arcade functions');

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		if (message.author.bot) return;

		if (message.channelId == streakChannel) {
			updateStreak(message);
		}
	},
};