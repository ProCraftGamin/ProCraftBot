const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('read-file')
		.setDescription('-')
		.setDMPermission(false)
		.addStringOption(option =>
			option.setName('path')
				.setDescription('path of the file')
				.setRequired(true)),
	async execute(interaction) {
		const data = fs.readFileSync(interaction.options.getString('path').replace('\\', '\\\\').replace('"', '').replace('"', '')).toString().split('\n');

		let fileContent = ('');

		for (let i = 0; i < data.length; i++) {
			fileContent = ` ${fileContent}\n*${i + 1} |* ${data[i]}`;
		}
		const embed = new EmbedBuilder()
			.setTitle('File contents:')
			.setDescription(fileContent);
		await interaction.reply({ embeds: [embed] });
	},
};