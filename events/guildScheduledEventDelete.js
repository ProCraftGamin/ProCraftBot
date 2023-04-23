const { EmbedBuilder, roleMention, userMention } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { eventsChannel } = require('../config.json');

module.exports = {
	name: 'guildScheduledEventDelete',
	async execute(GuildScheduledEvent) {
		const embed = new EmbedBuilder()
			.setColor('Red')
			.setAuthor({ name: 'An event has been canceled!', iconURL: 'https://hotemoji.com/images/dl/u/double-exclamation-mark-emoji-by-twitter.png' })
			.setTitle(`"${GuildScheduledEvent.name}" has been canceled!`)
			.setDescription(`'We're sorry for the inconvenience, but something just didn't work out. Probably blame ${userMention('775420795861205013')}.`);

		GuildScheduledEvent.guild.channels.fetch(eventsChannel).send({ content: roleMention(GuildScheduledEvent.guild.roles.cache.find(role => role.name === GuildScheduledEvent.name).id), embeds: [embed] }).then(async sentMessage => {
			await wait (1000);
			await sentMessage.edit({ content: '', embeds: [embed] });
		});
		await wait (2500);
		await GuildScheduledEvent.guild.roles.delete(GuildScheduledEvent.guild.roles.cache.find(role => role.name === GuildScheduledEvent.name).id);
	},
};