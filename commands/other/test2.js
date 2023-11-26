const { SlashCommandBuilder } = require('discord.js');
const { clearBugReports } = require('../../data/general functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('-'),
	async execute(interaction) {
		clearBugReports(interaction.client);
	},
};