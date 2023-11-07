const { EmbedBuilder } = require('discord.js');

module.exports = {
	fields: {
		selectMenu: {
			label: '🌱 Touch grass',
			description: 'i send you a video of me touching grass (IMPOSSIBLE)',
			value: 'touchGrass',
		},
		expandedView: {
			title: '🌱 Touch Grass',
			description: 'Force me to send you a video of me going outside and touching grass',
		},
	},
	cost: 10000,
	requestQueue: false,
	enabled: true,
	async execute(interaction) {
		let embed = new EmbedBuilder()
			.setAuthor({ name: `${interaction.user.displayName} would like you to touch grass`, iconURL: 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Ficons.iconarchive.com%2Ficons%2Fgoogle%2Fnoto-emoji-animals-nature%2F1024%2F22328-seedling-icon.png&f=1&nofb=1&ipt=397ab5a153ea5f72475fcc1ddcabd6fd02bdeb63c2f70837cd87c65f01fe11a7&ipo=images' })
			.setColor('DarkGreen');

		await interaction.client.users.fetch('775420795861205013').then(async (user) => await user.send({ embeds: [embed] }));

		embed = new EmbedBuilder()
			.setColor('DarkGreen')
			.setAuthor({ name: 'ProCraftGamin has been notified. \nIf you don\'t receive the video within a week, please open a ticket', iconURL: 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Ficons.iconarchive.com%2Ficons%2Fgoogle%2Fnoto-emoji-animals-nature%2F1024%2F22328-seedling-icon.png&f=1&nofb=1&ipt=397ab5a153ea5f72475fcc1ddcabd6fd02bdeb63c2f70837cd87c65f01fe11a7&ipo=images' });

		await interaction.editReply({ embeds: [embed], components: [] });
	},
};