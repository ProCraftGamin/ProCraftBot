/* eslint-disable no-case-declarations */
const { EmbedBuilder, channelMention, roleMention } = require('discord.js');
const { eventsChannel } = require('../config.json');
const wait = require('node:timers/promises').setTimeout;
const fs = require('fs');
const path = require('path');

module.exports = {
	name: 'guildScheduledEventUpdate',
	async execute(GuildScheduledEvent) {
		const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/data.json')));
		switch (GuildScheduledEvent.status) {
		case 1:
			const startedEmbed = new EmbedBuilder ()
				.setTitle(`"${GuildScheduledEvent.name}" has started!`)
				.setDescription(`Join us in ${channelMention(GuildScheduledEvent.channelId)} for some fun!`)
				.setColor('DarkGreen')
				.setTimestamp();

			GuildScheduledEvent.guild.channels.fetch(eventsChannel).then(channel => {
				channel.send({ content: roleMention(GuildScheduledEvent.guild.roles.cache.find(role => role.name === GuildScheduledEvent.name).id), embeds: [startedEmbed] }).then(async sentMessage => {
					await wait (1000);
					sentMessage.edit({ content: '', embeds: [startedEmbed] });
					channel.messages.fetch(data.events[GuildScheduledEvent.id]['message-id']).then(async message => {
						await message.edit({ components: [], embeds: [new EmbedBuilder().setAuthor({ name: 'Event Info', iconURL: 'https://em-content.zobj.net/source/microsoft/378/bell_1f514.png' }).setTitle(GuildScheduledEvent.name).setDescription(`${GuildScheduledEvent.description}\n\n*Event started on <t:${Math.floor(new Date() / 1000)}:F>*`).setTimestamp().setColor('DarkGreen')] });
						await wait(100000);
						await sentMessage.delete();
					});
				});
			});
			break;
		case 2:
			const endedEmbed = new EmbedBuilder ()
				.setTitle(`"${GuildScheduledEvent.name}" has ended!`)
				.setDescription('Thank you for coming!')
				.setColor('DarkRed')
				.setTimestamp();

			GuildScheduledEvent.guild.roles.delete(GuildScheduledEvent.guild.roles.cache.find(role => role.name === GuildScheduledEvent.name).id);

			GuildScheduledEvent.guild.channels.fetch(eventsChannel).then(channel => {
				channel.messages.fetch(data.events[GuildScheduledEvent.id]['message-id']).then(async message => {
					await message.edit({ embeds: [new EmbedBuilder().setAuthor({ name: 'Event Info', iconURL: 'https://em-content.zobj.net/source/microsoft/378/bell_1f514.png' }).setTitle(GuildScheduledEvent.name).setDescription(`${GuildScheduledEvent.description}\n\n*Event ended on <t:${Math.floor(new Date() / 1000)}:F>*`).setTimestamp().setColor('DarkRed')] });
					delete data.events[GuildScheduledEvent.id];
					await wait(100);
					fs.writeFileSync(path.join(__dirname, '../data/data.json'), JSON.stringify(data, null, 2));
					channel.send({ embeds: [endedEmbed] }).then(async msg => {
						await wait(100000);
						await msg.delete();
					});
				});
			});
		}
	},

};