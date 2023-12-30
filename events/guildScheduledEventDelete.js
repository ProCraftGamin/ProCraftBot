const { EmbedBuilder, roleMention, userMention } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { eventsChannel } = require('../config.json');
const fs = require('fs');
const path = require('path');

module.exports = {
	name: 'guildScheduledEventDelete',
	async execute(GuildScheduledEvent) {
		const embed = new EmbedBuilder()
			.setColor('Red')
			.setAuthor({ name: 'Event info', iconURL: 'https://hotemoji.com/images/dl/u/double-exclamation-mark-emoji-by-twitter.png' })
			.setTitle(`"${GuildScheduledEvent.name}" has been canceled!`)
			.setDescription(`'We're sorry for the inconvenience, but something just didn't work out. Probably blame ${userMention('775420795861205013')}.`)
			.setTimestamp();

		GuildScheduledEvent.guild.channels.fetch(eventsChannel).then(async channel => {
			channel.send({ content: roleMention(GuildScheduledEvent.guild.roles.cache.find(role => role.name === GuildScheduledEvent.name).id), embeds: [embed] }).then(async sentMessage => {

				await wait (1000);
				await sentMessage.edit({ content: '', embeds: [embed] });
			});
		});
		await wait (2500);
		GuildScheduledEvent.guild.roles.delete(GuildScheduledEvent.guild.roles.cache.find(role => role.name === GuildScheduledEvent.name).id);
		const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/data.json')));
		GuildScheduledEvent.guild.channels.fetch(eventsChannel).then(channel => {
			channel.messages.fetch(data.events[GuildScheduledEvent.id]['message-id']).then(async message => {
				await message.delete();
				delete data.events[GuildScheduledEvent.id];
				await wait(100);
				fs.writeFileSync(path.join(__dirname, '../data/data.json'), JSON.stringify(data, null, 2));
			});
		});
	},
};