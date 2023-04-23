const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'guildBanAdd',
	once: true,
	async execute(GuildBan) {
		console.log(`${GuildBan.user.username} was banned`);
		const embed = new EmbedBuilder()
			.setColor('DarkRed')
			.setAuthor({ name: `${GuildBan.user.username} was banned. L + Ratio`, iconURL: GuildBan.user.displayAvatarURL() });

		await GuildBan.guild.channels.fetch('958518158359162950').send({ embeds: [embed] });
	},
};