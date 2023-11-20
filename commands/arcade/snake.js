/* eslint-disable no-unused-vars */
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { builtinModules } = require('node:module');
const wait = require('node:timers/promises').setTimeout;
const { addBal } = require('../../data/arcade functions.js');

let intervalId = null;
let collector = null;
let row = null;
let embed = null;

const game = {
	running: false,
	boardSize: { w: 11, h: 10 },
	score: 0,
	snakeDir: 'up',
};
game.snakePos = [[Math.floor(game.boardSize.w / 2) + 1, Math.floor(game.boardSize.h / 2)]];
game.foodPos = [
	Math.floor(Math.random() * (game.boardSize.w - 1)) + 1,
	Math.floor(Math.random() * (game.boardSize.h - 1)) + 1,
];


const hasDuplicates = (array) => {
	const valuesSoFar = Object.create(null);
	for (let i = 0; i < array.length; ++i) {
		const value = array[i];
		if (value in valuesSoFar) {
			return true;
		}
		valuesSoFar[value] = true;
	}
	return false;
};

const renderBoard = () => {
	let board = '🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫\n';

	for (let c = 1; c <= game.boardSize.h; c++) {
		board += '🟫';
		for (let r = 1; r <= game.boardSize.w; r++) {
			if (r == game.snakePos[0][0] && c == game.snakePos[0][1]) {
				if (game.running == true) {
					board += '🤢';
				} else {
					board += '🤮';
				}
			} else if (r == game.foodPos[0] && c == game.foodPos[1]) {
				board += '🍎';
			} else {
				let isTailSegment = false;
				for (let i = 1; i < game.snakePos.length; i++) {
					if (r === game.snakePos[i][0] && c === game.snakePos[i][1]) {
						// Render the tail segment as 🟢
						board += '🟢';
						isTailSegment = true;
						break;
					}
				}
				if (!isTailSegment) {
					board += ':black_large_square:';
				}
			}
		}
		board += '🟫';
		board += '\n';
	}
	board += '🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫🟫';
	return board;
};

const updateSnake = async (m, i) => {
	const leftButton = new ButtonBuilder()
		.setCustomId('c|left')
		.setStyle(ButtonStyle.Success)
		.setLabel('⬅️');

	const upButton = new ButtonBuilder()
		.setCustomId('c|up')
		.setStyle(ButtonStyle.Success)
		.setLabel('⬆️');

	const downButton = new ButtonBuilder()
		.setCustomId('c|down')
		.setStyle(ButtonStyle.Success)
		.setLabel('⬇️');

	const rightButton = new ButtonBuilder()
		.setCustomId('c|right')
		.setStyle(ButtonStyle.Success)
		.setLabel('➡️');

	const snakePosNew = game.snakePos.map(pos => [...pos]);
	switch (game.snakeDir) {
	case 'up':
		snakePosNew.unshift([game.snakePos[0][0], game.snakePos[0][1] - 1]);
		downButton.setDisabled(true);
		break;
	case 'down':
		snakePosNew.unshift([game.snakePos[0][0], game.snakePos[0][1] + 1]);
		upButton.setDisabled(true);
		break;
	case 'left':
		snakePosNew.unshift([game.snakePos[0][0] - 1, game.snakePos[0][1]]);
		rightButton.setDisabled(true);
		break;
	case 'right':
		snakePosNew.unshift([game.snakePos[0][0] + 1, game.snakePos[0][1]]);
		leftButton.setDisabled(true);
		break;
	}
	if (snakePosNew[0][0] == game.foodPos[0] && snakePosNew[0][1] == game.foodPos[1]) {
		game.foodPos = [
			Math.floor(Math.random() * (game.boardSize.w - 1)) + 1,
			Math.floor(Math.random() * (game.boardSize.h - 1)) + 1,
		];

		while (snakePosNew[0][0] == game.foodPos[0] && snakePosNew[0][1] == game.foodPos[1] || snakePosNew.some((item) => {
			if (item[0] == game.foodPos[0] && item[1] == game.foodPos[1]) return true;
		})) {
			game.foodPos = [
				Math.floor(Math.random() * (game.boardSize.w - 1)) + 1,
				Math.floor(Math.random() * (game.boardSize.h - 1)) + 1,
			];
		}

		game.score += 50;
	} else {
		snakePosNew.pop();
	}

	const tailCollision = hasDuplicates(snakePosNew);
	if (snakePosNew[0][0] == 0 || snakePosNew[0][1] == 0 || snakePosNew[0][0] > game.boardSize.w || snakePosNew[0][1] > game.boardSize.h || tailCollision) {
		clearInterval(intervalId);
		game.running = false;
		collector.stop();
		addBal(i.user.id, game.score);


		const board = renderBoard();
		embed = new EmbedBuilder()
			.setColor('Red')
			.setAuthor({ name: `You died! Score: ${game.score}`, iconURL: i.user.displayAvatarURL() })
			.setDescription(board)
			.setFooter({ text: `You have been paid out ${game.score} points!` });

		await m.edit({ embeds: [embed], components: [] });
		game.snakePos = [[Math.floor(game.boardSize.w / 2), Math.floor(game.boardSize.h / 2)]];
		game.score = 0;
	} else {
		game.snakePos = snakePosNew;

		const board = await renderBoard();

		embed = new EmbedBuilder()
			.setAuthor({ name: `${i.user.displayName} • Score: ${game.score}`, iconURL: i.user.displayAvatarURL() })
			.setColor('Green')
			.setDescription(board);

		await m.edit({ embeds: [embed], components: [new ActionRowBuilder().addComponents(leftButton, upButton, downButton, rightButton)] });
	}
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('snake')
		.setDescription('Play a game of snake'),
	async execute(interaction) {
		if (game.running == true) {
			embed = new EmbedBuilder()
				.setColor('Red')
				.setAuthor({ name: 'Someone is already playing snake, please wait for their game to end!', iconURL: interaction.user.displayAvatarURL() });

			await interaction.reply({ embeds: [embed], ephemeral: true });
		} else {
			game.running = true;
			const board = renderBoard();
			embed = new EmbedBuilder()
				.setAuthor({ name: `${interaction.user.displayName} • Score: ${game.score}`, iconURL: interaction.user.displayAvatarURL() })
				.setColor('Green')
				.setDescription(board);

			row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('c|left')
						.setStyle(ButtonStyle.Success)
						.setLabel('⬅️'),

					new ButtonBuilder()
						.setCustomId('c|up')
						.setStyle(ButtonStyle.Success)
						.setLabel('⬆️'),

					new ButtonBuilder()
						.setCustomId('c|down')
						.setStyle(ButtonStyle.Success)
						.setLabel('⬇️'),

					new ButtonBuilder()
						.setCustomId('c|right')
						.setStyle(ButtonStyle.Success)
						.setLabel('➡️'),
				);

			const filter = (i) => i.user.id == interaction.user.id;

			await interaction.reply({ embeds: [embed], components: [row] }).then(message => {
				intervalId = setInterval(updateSnake, 1000, message, interaction);

				collector = message.createMessageComponentCollector({ filter, time: 600000 });
			});

			collector.on('collect', async (collected) => {
				collected.deferUpdate();
				switch (collected.customId) {
				case 'c|left':
					game.snakeDir = 'left';
					break;

				case 'c|up':
					game.snakeDir = 'up';
					break;

				case 'c|down':
					game.snakeDir = 'down';
					break;

				case 'c|right':
					game.snakeDir = 'right';
					break;
				}
			});

			collector.on('end', () => {
				if (game.running) {
					collector = interaction.message.createMessageComponentCollector({ filter, time: 600000 });
				}
			});
		}
	},

};