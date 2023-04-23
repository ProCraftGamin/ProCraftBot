const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { transferBal } = require('../../data/arcade utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('give-points')
		.setDescription('Lets you give ProCraft Points to someone else!')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to give points to')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('The amount to give to the user')
				.setRequired(true)),
	async execute(interaction) {
		const status = transferBal(interaction.user.id, interaction.options.getUser('user').id, interaction.options.getInteger('amount'));
		if (!status) {
			const embed = new EmbedBuilder()
				.setAuthor({ name: 'An error occured while trying to transfer points. Please try again later.' })
				.setColor('DarkRed');
			await interaction.reply({ embeds: [embed] });
		} else {
			const embed = new EmbedBuilder()
				.setAuthor({ name: `Successfully gave ${interaction.options.getInteger('amount')} ProCraft Points to ${interaction.options.getUser('user').username}`, iconUrl: interaction.options.getUser('user').displayAvatarURL() })
				.setColor('DarkGreen');
			await interaction.reply({ embeds: [embed] });
		}
	},
};