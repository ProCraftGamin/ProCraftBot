const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { getBal, transferBal } = require('../../data/arcade functions.js');
let embed = null;
let game = {
	turn: 1,
	running: false,
	board: {
		'1': {},
		'2': {},
		'3': {},
		'4': {},
		'5': {},
		'6': {},
		'7': {},
	},
};
let row = null;
let filter = null;

const checkWin = async () => {
	// for the directions, in the array the first element is vertical, second is horizontal
	const directions = [
		[0, 1], // left
		[0, -1], // right
		[1, 0], // up
		[-1, 0], // down
		[1, 1], // diagonal up left
		[1, -1], // diagonal up right
		[-1, 1], // diagional down left
		[-1, -1], // diagonal down right
	];

	let tempC = null;
	let tempR = null;
	let counter = 1;

	// for each column
	for (let c = 1; c < 8; c++) {
		// for each row
		for (let r = 1; r < 7; r++) {
			// if there is a token in the selected position
			if (game.board[c][r] !== null) {
				tempC = c;
				tempR = r;

				if (game.board[tempC][tempR] !== null) {

					for (const direction in directions) {
						tempC = c;
						tempR = r;
						counter = 0;
						for (let i = 0; i < 4; i++) {
							if (tempC <= 0 || tempR <= 0 || tempC > 7 || tempR > 6) break;
							if (game.board[tempC][tempR] == game.board[c][r] && game.board[tempC][tempR] !== undefined) {
								counter++;
								if (counter == 4) return game.board[c][r];

								tempC = tempC + directions[direction][1];
								tempR = tempR + directions[direction][0];
							} else {
								break;
							}
						}
					}
				}
			}
		}
	}
	return null;
};

const executeGame = async (m, i) => {
	const winner = await checkWin();

	const numRows = 6;
	const numCols = 7;


	// render board

	let renderedBoard = '🟦:one::two::three::four::five::six::seven:🟦\n';

	// eslint-disable-next-line no-shadow
	for (let row = numRows; row >= 1; row--) {
		renderedBoard += '🟦'; // Add left border for the square outline
		for (let col = 1; col <= numCols; col++) {
			const cellValue = game.board[col] && game.board[col][row];
			if (cellValue === true) {
				renderedBoard += '🔴'; // Represent "true" as 🔴 for red
			} else if (cellValue === false) {
				renderedBoard += '🟡'; // Represent "false" as 🟡 for yellow
			} else {
				renderedBoard += ':black_circle:'; // Empty cell represented as ⚫️
			}
		}
		renderedBoard += '🟦\n'; // Add right border for the square outline and a newline
	}

	renderedBoard += '🟦🟦🟦🟦🟦🟦🟦🟦🟦'; // Add the bottom border for the square outline

	let fullGame = true;
	for (const item in game.board) {
		if (!(numCols in game.board[item])) {
			fullGame = false;
		}
	}

	if (winner !== null) {
		game = {
			turn: 1,
			running: false,
			board: {
				'1': {},
				'2': {},
				'3': {},
				'4': {},
				'5': {},
				'6': {},
				'7': {},
			},
		};
		if (winner) {
			embed = new EmbedBuilder()
				.setColor('Green')
				.setAuthor({ name: `${i.user.displayName} won the game!`, iconURL: i.user.displayAvatarURL() })
				.setDescription(renderedBoard);

			transferBal(i.options.getUser('opponent').id, i.user.id, i.options.getInteger('amount'));
		} else if (!winner) {
			embed = new EmbedBuilder()
				.setColor('Green')
				.setAuthor({ name: `${i.options.getUser('opponent').displayName} won the game!`, iconURL: i.options.getUser('opponent').displayAvatarURL() })
				.setDescription(renderedBoard);

			transferBal(i.user.id, i.options.getUser('opponent').id, i.options.getInteger('amount'));
		}

		await m.edit({ embeds: [embed] });
	} else if (fullGame) {
		game = {
			turn: 1,
			running: false,
			board: {
				'1': {},
				'2': {},
				'3': {},
				'4': {},
				'5': {},
				'6': {},
				'7': {},
			},
		};
		embed = new EmbedBuilder()
			.setAuthor({ name: 'Nobody won. All points have been returned' })
			.setColor('DarkBlue')
			.setDescription(renderedBoard);

		await m.edit({ embeds: [embed] });
	} else {


		embed = new EmbedBuilder()
			.setColor('DarkBlue')
			.setTitle(`${i.user.displayName} VS ${i.options.getUser('opponent').displayName}`)
			.setDescription(`${renderedBoard}\n\n*Send a number between 1 and 7 to place your token!*`);

		if (game.turn == 1) {
			embed.setFooter({ text: `It is ${i.user.displayName}'s turn`, iconURL: i.user.displayAvatarURL() });
			filter = (c) => c.author.id === i.user.id;
		} else if (game.turn == 2) {
			embed.setFooter({ text: `It is ${i.options.getUser('opponent').displayName}'s turn`, iconURL: i.options.getUser('opponent').displayAvatarURL() });
			filter = (c) => c.author.id === i.options.getUser('opponent').id;
		}

		await m.edit({ embeds: [embed] });

		m.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] })
			.then(async collected => {
				if (parseInt(collected.first().content) > 0 && parseInt(collected.first().content) < 8) {
					if (numRows in game.board[parseInt(collected.first().content)]) {
						await collected.first().reply('**That column is full, please choose a different column!**').then(async m2 => {
							executeGame(m, i);
							await collected.first().delete();
							await wait(5000);
							await m2.delete();
						});

					} else if (game.turn == 1) {
						game.board[parseInt(collected.first().content)][Object.keys(game.board[parseInt(collected.first().content)]).length + 1] = true;

						game.turn = 2;
						executeGame(m, i);
					} else if (game.turn == 2) {
						game.board[parseInt(collected.first().content)][Object.keys(game.board[parseInt(collected.first().content)]).length + 1] = false;

						game.turn = 1;
						executeGame(m, i);
					}
				} else {
					executeGame(m, i);
				}
				await collected.first().delete();
			}).catch(async () => {
				game = {
					turn: 1,
					running: false,
					board: {
						'1': {},
						'2': {},
						'3': {},
						'4': {},
						'5': {},
						'6': {},
						'7': {},
					},
				};
				if (game.turn == 1) {
					embed = new EmbedBuilder()
						.setAuthor({ name: `${i.user.displayName} didn't make a move in time, so the game has been canceled.`, iconURL: i.user.displayAvatarURL() })
						.setColor('Red');
				} else if (game.turn == 2) {
					embed = new EmbedBuilder()
						.setAuthor({ name: `${i.options.getUser('opponent').displayName} didn't make a move in time, so the game has been canceled.`, iconURL: i.options.getUser('opponent').displayAvatarURL() })
						.setColor('Red');
				}
				await m.edit({ embeds: [embed] }).then(async m2 => {
					await wait(10000);
					await m2.delete();
				});
			});
	}
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('connect4')
		.setDescription('Play a game of Connect 4 against someone else!')
		.addUserOption(option =>
			option
				.setName('opponent')
				.setDescription('The user you want to play against.')
				.setRequired(true))
		.addIntegerOption(option =>
			option
				.setName('amount')
				.setDescription('The amount of points to bet')
				.setRequired(true)),
	async execute(interaction) {


		const user1Bal = getBal(interaction.user.id);
		const user2Bal = getBal(interaction.options.getUser('opponent').id);
		if (!user1Bal || user1Bal < interaction.options.getInteger('amount')) {
			embed = new EmbedBuilder()
				.setColor('DarkRed')
				.setTitle('You don\'t have enough for this bet!');
			await interaction.reply({ embeds: [embed], ephemeral: true });
		} else if (!user2Bal || user2Bal < interaction.options.getInteger('amount')) {
			embed = new EmbedBuilder()
				.setColor('DarkRed')
				.setTitle(`${interaction.options.getUser('user').username} doesn't have enough for this bet!`);
			await interaction.reply({ embeds: [embed], ephemeral: true });
		} else if (game.running === true) {
			embed = new EmbedBuilder()
				.setAuthor({ name: 'Another game is currently in progress, please wait for it to end.' });
		} else {
			// 1 is user who used the command, 2 is the user they challenged
			embed = new EmbedBuilder()
				.setColor('DarkRed')
				.setDescription('Use the button below to accept!\nIf you do not accept within 60 seconds, the game will be cancelled.');

			if (interaction.options.getInteger('amount') == 1) {
				embed.setAuthor({ name: `${interaction.user.displayName} is challenging you to a game of Connect 4 for ${interaction.options.getInteger('amount')} ProCraft Point!`, iconURL: interaction.user.displayAvatarURL() });
			} else {
				embed.setAuthor({ name: `${interaction.user.displayName} is challenging you to a game of Connect 4 for ${interaction.options.getInteger('amount')} ProCraft Points!`, iconURL: interaction.user.displayAvatarURL() });
			}

			row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('c|accept')
						.setLabel('Accept')
						.setStyle(ButtonStyle.Success),
				);

			filter = (int) => int.user.id == interaction.options.getUser('opponent').id && int.customId == 'c|accept';

			await interaction.reply({ content: `<@${interaction.options.getUser('opponent').id}>`, embeds: [embed], components: [row] }).then (message => {
				// create a collector for when the accept button is pressed
				const collector = message.createMessageComponentCollector({ filter, time: 60000 });

				collector.on('collect', async () => {
					embed = new EmbedBuilder()
						.setColor('DarkBlue')
						.setAuthor({ name: 'Loading...' });

					await interaction.deleteReply();
					// eslint-disable-next-line no-shadow
					await interaction.channel.send({ embeds: [embed] }).then(message => {
						executeGame(message, interaction);
					});
				});

				collector.on('end', async (collected) => {
					if (collected.size == 0) {
						embed = new EmbedBuilder()
							.setTitle(`${interaction.options.getUser('opponent').displayName} did not accept in time, so the game has been cancelled.`)
							.setColor('DarkRed');
						interaction.followUp({ embeds: [embed], ephemeral: true });
						interaction.deleteReply();
					}
				});
			});

		}
	},
};