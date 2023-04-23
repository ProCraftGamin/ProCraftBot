const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, Colors } = require('discord.js');
const { eventsChannel } = require('../config.json');

module.exports = {
	name: 'guildScheduledEventCreate',
	async execute(GuildScheduledEvent) {
		const embed = new EmbedBuilder()
			.setColor('DarkGreen')
			.setAuthor({ name: 'A new event has been scheduled!' })
			.setTitle(GuildScheduledEvent.name)
			.setDescription(`${GuildScheduledEvent.description}\n\n*Event starts on ${GuildScheduledEvent.scheduledStartAt}*`);

		await GuildScheduledEvent.guild.roles.create({ name: GuildScheduledEvent.name, color: Colors.DarkGreen });

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(`e|${GuildScheduledEvent.guild.roles.cache.find(role => role.name === GuildScheduledEvent.name).id}|1049870120392081518`)
					.setLabel('🔔 Notify me')
					.setStyle(ButtonStyle.Success),
			);


		await GuildScheduledEvent.guild.channels.fetch(eventsChannel).send({ embeds: [embed], components: [row] });
	},
};