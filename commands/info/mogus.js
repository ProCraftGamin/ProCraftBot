const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { removeBal } = require('../../data/arcade functions');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('mogus')
		.setDescription('mogus sussy sus'),
	async execute(interaction) {
		console.log(`${interaction.user.displayName} paid to see mogus`);
		removeBal(interaction.user.id, 1000);
		const embed = new EmbedBuilder()
			.setColor('Yellow')
			.setImage('https://media1.tenor.com/m/EWuNdhEYlVkAAAAd/kriziebizie-krizziebuoy.gif')
			.setFooter({ text: 'You have now paid 1000 ProCraft Points to look at mogus\'s beauty' });

		await interaction.reply({ embeds: [embed] });
	},
};