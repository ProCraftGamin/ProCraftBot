const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'guildBanAdd',
	once: true,
	execute(GuildBan) {
		console.log(`${GuildBan.user.username} was banned`);
		const embed = new EmbedBuilder()
			.setColor('DarkRed')
			.setAuthor({ name: `${GuildBan.user.username} was banned. L + Ratio`, iconURL: GuildBan.user.avatarURL() });

		GuildBan.guild.channels.cache.get('958518158359162950').send({ embeds: [embed] });
	},
};