const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('-'),
	async execute(interaction) {
		let returnMessage = '';

		// generate top border
		for (let i = 0; i < 13; i++) {
			returnMessage = returnMessage + '🟩';
		}
		returnMessage = returnMessage + '\n';

		// generate snake area
		// height loop
		for (let i = 0; i < 10; i++) {
			returnMessage = returnMessage + '🟩';

			// width loop
			for (let j = 0; j < 11; j++) {
				returnMessage = returnMessage + '⬛';
			}
			returnMessage = returnMessage + '🟩\n';
		}
		// generate bottom border
		for (let i = 0; i < 13; i++) {
			returnMessage = returnMessage + '🟩';
		}

		console.log(returnMessage);
		await interaction.reply(returnMessage);
	},
};