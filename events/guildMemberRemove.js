const { EmbedBuilder } = require('discord.js');
const { welcomeChannel } = require('../config.json');

module.exports = {
	name: 'guildMemberRemove',
	async execute(GuildMember) {
		const embed = new EmbedBuilder()
			.setColor('DarkRed')
			.setAuthor({ name: `${GuildMember.user.username} left the server.`, iconURL: GuildMember.user.displayAvatarURL() });

		await GuildMember.guild.channels.fetch(welcomeChannel).send({ embeds: [embed] });
	},
};