const { EmbedBuilder } = require('discord.js');
const { updateStocks } = require('../data/general functions.js');

module.exports = {
	name: 'guildBanAdd',
	once: true,
	async execute(GuildBan) {
		console.log(`${GuildBan.user.username} was banned`);
		const embed = new EmbedBuilder()
			.setColor('DarkRed')
			.setAuthor({ name: `${GuildBan.user.username} was banned. L + Ratio`, iconURL: GuildBan.user.displayAvatarURL() });

		const channel = await GuildBan.guild.channels.fetch('958518158359162950');
		await channel.send({ embeds: [embed] });

		updateStocks('PCD', 100, '-', GuildBan.client);
	},
};