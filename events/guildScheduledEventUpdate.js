/* eslint-disable no-case-declarations */
const { EmbedBuilder, channelMention, roleMention } = require('discord.js');
const { eventsChannel } = require('../config.json');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	name: 'guildScheduledEventUpdate',
	async execute(GuildScheduledEvent) {
		switch (GuildScheduledEvent.status) {
		case 1:
			const startedEmbed = new EmbedBuilder ()
				.setAuthor({ name: 'An event has started!' })
				.setTitle(`"${GuildScheduledEvent.name}" has started!`)
				.setDescription(`Join us in ${channelMention(GuildScheduledEvent.channelId)} for some fun!`)
				.setColor('DarkGreen');

			GuildScheduledEvent.guild.channels.fetch(eventsChannel).send({ content: roleMention(GuildScheduledEvent.guild.roles.cache.find(role => role.name === GuildScheduledEvent.name).id), embeds: [startedEmbed] }).then(async sentMessage => {
				await wait (1000);
				sentMessage.edit({ content: '', embeds: [startedEmbed] });
			});
			break;
		case 2:
			const endedEmbed = new EmbedBuilder ()
				.setAuthor({ name: 'An event has ended!' })
				.setTitle(`"${GuildScheduledEvent.name}" has ended!`)
				.setDescription('Thank you for coming!')
				.setColor('DarkRed');

			GuildScheduledEvent.guild.channels.fetch(eventsChannel).send({ embeds: [endedEmbed] });
			GuildScheduledEvent.guild.roles.delete(GuildScheduledEvent.guild.roles.cache.find(role => role.name === GuildScheduledEvent.name).id);
		}


	},

};