/* eslint-disable no-unused-vars */
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

const width = 11;
const height = 10;

// eslint-disable-next-line prefer-const
let snakePos = [[Math.floor(width / 2), Math.floor(height / 2)]];

const executeSnake = async (pos, w, h, intera) => {
	let board = '';

	// generate top border
	for (let i = 0; i < width + 2; i++) {
		board = board + '🟩';
	}
	board = board + '\n';

	// generate snake area
	// height loop
	for (let i = 0; i < height; i++) {
		board = board + '🟩';

		// width loop
		for (let j = 0; j < width; j++) {
			if (j == pos[0][1] && i == pos[0][0]) {
				board = board + '🤢';
			} else {
				board = board + '⬛';
			}
		}
		board = board + '🟩\n';
	}
	// generate bottom border
	for (let i = 0; i < width + 2; i++) {
		board = board + '🟩';
	}

	await intera.editReply({ content: board, embeds: [] });

};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('snake')
		.setDescription('Play a game of snake'),
	async execute(interaction) {
		await interaction.reply('Loading snake...');
		for (let i = 5; i >= 0; i--) {
			if (i == 1) {
				const startEmbed = new EmbedBuilder()
					.setColor('Green')
					.setAuthor({ name: 'Snake' })
					.setTitle('How to play')
					.setDescription('Every second, the snake will move. \n\n**Use ⬆️,⬇️,⬅️, and ➡️ to control the snake, and 🔃 to restart.**\n\nEvery 🍎 will give you 50 ProCraft Points, and at the end you will be given ProCraft Points based on how many 🍎 you collected.')
					.setFooter({ text: `The game will start in ${i} second` });

				await interaction.editReply({ embeds: [startEmbed] });
			} else {
				const startEmbed = new EmbedBuilder()
					.setColor('Green')
					.setAuthor({ name: 'Snake' })
					.setTitle('How to play')
					.setDescription('Every second, the snake will move. \n\n**Use ⬆️,⬇️,⬅️, and ➡️ to control the snake, and 🔃 to restart.**\n\nEvery 🍎 will give you 50 ProCraft Points, and at the end you will be given ProCraft Points based on how many 🍎 you collected.')
					.setFooter({ text: `The game will start in ${i} seconds` });

				await interaction.editReply({ content: ' ', embeds: [startEmbed] });
			}
			await wait (1000);


		}
		executeSnake(snakePos, width, height, interaction);
	},
};