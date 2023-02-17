const { EmbedBuilder } = require('discord.js');
const { welcomeChannel } = require('../config.json');

module.exports = {
	name: 'guildMemberRemove',
	async execute(GuildMember) {
		const embed = new EmbedBuilder()
			.setColor('DarkRed')
			.setAuthor({ name: `${GuildMember.user.username} left the server.`, iconURL: GuildMember.user.avatarURL() });

		GuildMember.guild.channels.cache.get(welcomeChannel).send({ embeds: [embed] });
	},
};