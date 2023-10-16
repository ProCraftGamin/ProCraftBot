const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { setBal } = require('../../data/arcade functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-bal')
		.setDescription('ADMIN ONLY')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false)
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to modify the balance of.')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('balance')
				.setDescription('The balance to give the user.')
				.setRequired(true)),
	async execute(interaction) {
		const setBalResult = await setBal(interaction.options.getUser('user').id, interaction.options.getInteger('balance'));
		if (!setBalResult) {
			interaction.reply({ content: `${interaction.options.getUser('user')} does not currently have an account!`, ephemeral: true });
		} else {
			interaction.reply({ content: `Successfully set ${interaction.options.getUser('user').displayName}'s balance to ${interaction.options.getInteger('balance')}.`, ephemeral: true });
		}
	},
};