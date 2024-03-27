const { streakChannel } = require('../config.json');
const { updateStreak } = require('../data/arcade functions');
const { guildId } = require('../config.json');

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		if (message.author.bot) return;

		if (message.channelId == streakChannel) {
			updateStreak(message);
		} else if (message.author.id == '1189135123082383370' && (message.cleanContent.toLowerCase().includes('nice') || message.cleanContent.toLowerCase().includes('idc'))) {
			message.client.guilds.fetch(guildId).then(guild => {
				guild.members.fetch(message.author.id).then(async member => {
					await member.timeout(60000, 'said nice or idc');
				});
			});
		}
	},
};