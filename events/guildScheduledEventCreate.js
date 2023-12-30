const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, Colors } = require('discord.js');
const { eventsChannel } = require('../config.json');
const fs = require('fs');
const path = require('path');

module.exports = {
	name: 'guildScheduledEventCreate',
	async execute(GuildScheduledEvent) {
		const embed = new EmbedBuilder()
			.setColor('DarkGreen')
			.setAuthor({ name: 'Event info', iconURL: 'https://em-content.zobj.net/source/microsoft/378/bell_1f514.png' })
			.setTitle(GuildScheduledEvent.name)
			.setDescription(`${GuildScheduledEvent.description}\n\n*Event starts on <t:${Math.floor(new Date(GuildScheduledEvent.scheduledStartTimestamp) / 1000)}:F>*`)
			.setTimestamp();

		await GuildScheduledEvent.guild.roles.create({ name: GuildScheduledEvent.name, color: Colors.DarkGreen });

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(`e|${GuildScheduledEvent.guild.roles.cache.find(role => role.name === GuildScheduledEvent.name).id}|1180688755745628220`)
					.setLabel('🔔 Notify me')
					.setStyle(ButtonStyle.Success),
			);


		GuildScheduledEvent.guild.channels.fetch(eventsChannel).then(channel => {
			channel.send({ embeds: [embed], components: [row] }).then(message => {
				const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/data.json')));
				data.events[GuildScheduledEvent.id] = { 'name': GuildScheduledEvent.name, 'description': GuildScheduledEvent.description, 'message-id': message.id };
				fs.writeFileSync(path.join(__dirname, '../data/data.json'), JSON.stringify(data, null, 2));
			});
		});
	},
};