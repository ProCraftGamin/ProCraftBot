const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// const wait = require('node:timers/promises').setTimeout;
// const fs = require('fs');
const { getBal } = require('../../data/arcade utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bal')
		.setDescription('Checks the balance of your account in the arcade!'),
	async execute(interaction) {
		const bal = await getBal(interaction.user.id);
		if (bal) {
			const embed = new EmbedBuilder()
				.setAuthor({ name: `${interaction.user.username}, you have ${bal} ProCraft Points in your account.`, iconURL: interaction.user.avatarURL() })
				.setColor('Blue');

			interaction.reply({ embeds: [embed] });
		} else {
			const embed = new EmbedBuilder()
				.setAuthor({ name: `${interaction.user.username}, you do not currently have an account! Create one with /open-acc!`, iconURL: 'https://hotemoji.com/images/dl/u/double-exclamation-mark-emoji-by-twitter.png' })
				.setColor('DarkRed');

			interaction.reply({ embeds: [embed] });
		}
	},
};