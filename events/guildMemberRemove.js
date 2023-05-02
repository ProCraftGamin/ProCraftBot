const { EmbedBuilder } = require('discord.js');
const { welcomeChannel } = require('../config.json');

module.exports = {
	name: 'guildMemberRemove',
	async execute(GuildMember) {
		const embed = new EmbedBuilder()
			.setColor('DarkRed')
			.setAuthor({ name: `${GuildMember.user.username} left the server.`, iconURL: GuildMember.user.displayAvatarURL() });

		const channel = await GuildMember.guild.channels.fetch(welcomeChannel);
		await channel.send({ embeds: [embed] });
	},
};