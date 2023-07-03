const { ActionRowBuilder, EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getBal, transferBal } = require('../../data/arcade utils.js');
const wait = require('node:timers/promises').setTimeout;

let game = {
	running: false,
	turn: 0,
	1: {
		1: {
			fill: '⬛',
			X: false,
			O: false,
		},
		2: {
			fill: '⬛',
			X: false,
			O: false,
		},
		3: {
			fill: '⬛',
			X: false,
			O: false,
		},
	},
	2: {
		1: {
			fill: '⬛',
			X: false,
			O: false,
		},
		2: {
			fill: '⬛',
			X: false,
			O: false,
		},
		3: {
			fill: '⬛',
			X: false,
			O: false,
		},
	},
	3: {
		1: {
			fill: '⬛',
			X: false,
			O: false,
		},
		2: {
			fill: '⬛',
			X: false,
			O: false,
		},
		3: {
			fill: '⬛',
			X: false,
			O: false,
		},
	},
};


// eslint-disable-next-line no-unused-vars
const executeGame = async (i, i2) => {
	let embed = '';
	let row0 = '';
	let row1 = '';
	let row2 = '';
	let status = '';

	switch (true) {
	case game[1][1].X && game[2][1].X && game[3][1].X:
		embed = new EmbedBuilder()
			.setAuthor({ name: `${i.user.username} VS ${i.options.getUser('user').username}` })
			.setTitle(`${i.user.username} won the game!`)
			.setColor('DarkGreen')
			.setDescription(`${game[1][1].fill}${game[1][2].fill}${game[1][3].fill}\n${game[2][1].fill}${game[2][2].fill}${game[2][3].fill}\n${game[3][1].fill}${game[3][2].fill}${game[3][3].fill}`);

		status = transferBal(i.options.getUser('user').id, i.user.id, i.options.getInteger('amount'));
		if (!status) {
			await i2.reply(`${i.user.username} won the game, but the balance wasn't transferred. **Please send a screenshot of this error to ProCraftGamin!**\nError: transferBal returned null.`);
		} else {
			await i2.edit({ embeds: [embed], components: [] });
		}

		game = {
			running: false,
			turn: 0,
			1: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			2: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			3: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
		};
		break;
	case game[1][1].O && game[2][1].O && game[3][1].O:
		embed = new EmbedBuilder()
			.setAuthor({ name: `${i.user.username} VS ${i.options.getUser('user').username}` })
			.setTitle(`${i.options.getUser('user').username} won the game!`)
			.setColor('DarkGreen')
			.setDescription(`${game[1][1].fill}${game[1][2].fill}${game[1][3].fill}\n${game[2][1].fill}${game[2][2].fill}${game[2][3].fill}\n${game[3][1].fill}${game[3][2].fill}${game[3][3].fill}`);

		status = transferBal(i.user.id, i.options.getUser('user').id, i.options.getInteger('amount'));
		if (!status) {
			await i2.reply(`${i.options.getUser('user').username} won the game, but an unexpected error occured while attempting to transfer points, so no ProCraft Points were transferred. **Please send a screenshot of this error to ProCraftGamin!**\nError: transferBal returned null.`);
		} else {
			await i2.edit({ embeds: [embed], components: [] });
		}

		game = {
			running: false,
			turn: 0,
			1: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			2: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			3: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
		};
		break;
	case game[1][2].X && game[2][2].X && game[3][2].X:
		embed = new EmbedBuilder()
			.setAuthor({ name: `${i.user.username} VS ${i.options.getUser('user').username}` })
			.setTitle(`${i.user.username} won the game!`)
			.setColor('DarkGreen')
			.setDescription(`${game[1][1].fill}${game[1][2].fill}${game[1][3].fill}\n${game[2][1].fill}${game[2][2].fill}${game[2][3].fill}\n${game[3][1].fill}${game[3][2].fill}${game[3][3].fill}`);

		status = transferBal(i.options.getUser('user').id, i.user.id, i.options.getInteger('amount'));
		if (!status) {
			await i2.reply(`${i.user.username} won the game, but the balance wasn't transferred. **Please send a screenshot of this error to ProCraftGamin!**\nError: transferBal returned null.`);
		} else {
			await i2.edit({ embeds: [embed], components: [] });
		}

		game = {
			running: false,
			turn: 0,
			1: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			2: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			3: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
		};
		break;
	case game[1][2].O && game[2][2].O && game[3][2].O:
		embed = new EmbedBuilder()
			.setAuthor({ name: `${i.user.username} VS ${i.options.getUser('user').username}` })
			.setTitle(`${i.options.getUser('user').username} won the game!`)
			.setColor('DarkGreen')
			.setDescription(`${game[1][1].fill}${game[1][2].fill}${game[1][3].fill}\n${game[2][1].fill}${game[2][2].fill}${game[2][3].fill}\n${game[3][1].fill}${game[3][2].fill}${game[3][3].fill}`);

		status = transferBal(i.user.id, i.options.getUser('user').id, i.options.getInteger('amount'));
		if (!status) {
			await i2.reply(`${i.options.getUser('user').username} won the game, but an unexpected error occured while attempting to transfer points, so no ProCraft Points were transferred. **Please send a screenshot of this error to ProCraftGamin!**\nError: transferBal returned null.`);
		} else {
			await i2.edit({ embeds: [embed], components: [] });
		}

		game = {
			running: false,
			turn: 0,
			1: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			2: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			3: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
		};
		break;
	case game[1][3].X && game[2][3].X && game[3][3].X:
		embed = new EmbedBuilder()
			.setAuthor({ name: `${i.user.username} VS ${i.options.getUser('user').username}` })
			.setTitle(`${i.user.username} won the game!`)
			.setColor('DarkGreen')
			.setDescription(`${game[1][1].fill}${game[1][2].fill}${game[1][3].fill}\n${game[2][1].fill}${game[2][2].fill}${game[2][3].fill}\n${game[3][1].fill}${game[3][2].fill}${game[3][3].fill}`);

		status = transferBal(i.options.getUser('user').id, i.user.id, i.options.getInteger('amount'));
		if (!status) {
			await i2.reply(`${i.user.username} won the game, but the balance wasn't transferred. **Please send a screenshot of this error to ProCraftGamin!**\nError: transferBal returned null.`);
		} else {
			await i2.edit({ embeds: [embed], components: [] });
		}

		game = {
			running: false,
			turn: 0,
			1: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			2: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			3: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
		};
		break;
	case game[1][3].O && game[2][3].O && game[3][3].O:
		embed = new EmbedBuilder()
			.setAuthor({ name: `${i.user.username} VS ${i.options.getUser('user').username}` })
			.setTitle(`${i.options.getUser('user').username} won the game!`)
			.setColor('DarkGreen')
			.setDescription(`${game[1][1].fill}${game[1][2].fill}${game[1][3].fill}\n${game[2][1].fill}${game[2][2].fill}${game[2][3].fill}\n${game[3][1].fill}${game[3][2].fill}${game[3][3].fill}`);

		status = transferBal(i.user.id, i.options.getUser('user').id, i.options.getInteger('amount'));
		if (!status) {
			await i2.reply(`${i.options.getUser('user').username} won the game, but an unexpected error occured while attempting to transfer points, so no ProCraft Points were transferred. **Please send a screenshot of this error to ProCraftGamin!**\nError: transferBal returned null.`);
		} else {
			await i2.edit({ embeds: [embed], components: [] });
		}

		game = {
			running: false,
			turn: 0,
			1: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			2: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			3: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
		};
		break;
	case game[1][1].X && game[2][2].X && game[3][3].X:
		embed = new EmbedBuilder()
			.setAuthor({ name: `${i.user.username} VS ${i.options.getUser('user').username}` })
			.setTitle(`${i.user.username} won the game!`)
			.setColor('DarkGreen')
			.setDescription(`${game[1][1].fill}${game[1][2].fill}${game[1][3].fill}\n${game[2][1].fill}${game[2][2].fill}${game[2][3].fill}\n${game[3][1].fill}${game[3][2].fill}${game[3][3].fill}`);

		status = transferBal(i.options.getUser('user').id, i.user.id, i.options.getInteger('amount'));
		if (!status) {
			await i2.reply(`${i.user.username} won the game, but the balance wasn't transferred. **Please send a screenshot of this error to ProCraftGamin!**\nError: transferBal returned null.`);
		} else {
			await i2.edit({ embeds: [embed], components: [] });
		}

		game = {
			running: false,
			turn: 0,
			1: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			2: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			3: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
		};
		break;
	case game[1][1].O && game[2][2].O && game[3][3].O:
		embed = new EmbedBuilder()
			.setAuthor({ name: `${i.user.username} VS ${i.options.getUser('user').username}` })
			.setTitle(`${i.options.getUser('user').username} won the game!`)
			.setColor('DarkGreen')
			.setDescription(`${game[1][1].fill}${game[1][2].fill}${game[1][3].fill}\n${game[2][1].fill}${game[2][2].fill}${game[2][3].fill}\n${game[3][1].fill}${game[3][2].fill}${game[3][3].fill}`);

		status = transferBal(i.user.id, i.options.getUser('user').id, i.options.getInteger('amount'));
		if (!status) {
			await i2.reply(`${i.options.getUser('user').username} won the game, but an unexpected error occured while attempting to transfer points, so no ProCraft Points were transferred. **Please send a screenshot of this error to ProCraftGamin!**\nError: transferBal returned null.`);
		} else {
			await i2.edit({ embeds: [embed], components: [] });
		}

		game = {
			running: false,
			turn: 0,
			1: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			2: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			3: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
		};
		break;
	case game[1][3].X && game[2][2].X && game[3][1].X:
		embed = new EmbedBuilder()
			.setAuthor({ name: `${i.user.username} VS ${i.options.getUser('user').username}` })
			.setTitle(`${i.user.username} won the game!`)
			.setColor('DarkGreen')
			.setDescription(`${game[1][1].fill}${game[1][2].fill}${game[1][3].fill}\n${game[2][1].fill}${game[2][2].fill}${game[2][3].fill}\n${game[3][1].fill}${game[3][2].fill}${game[3][3].fill}`);

		status = transferBal(i.options.getUser('user').id, i.user.id, i.options.getInteger('amount'));
		if (!status) {
			await i2.reply(`${i.user.username} won the game, but the balance wasn't transferred. **Please send a screenshot of this error to ProCraftGamin!**\nError: transferBal returned null.`);
		} else {
			await i2.edit({ embeds: [embed], components: [] });
		}

		game = {
			running: false,
			turn: 0,
			1: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			2: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			3: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
		};
		break;
	case game[1][3].O && game[2][2].O && game[3][1].O:
		embed = new EmbedBuilder()
			.setAuthor({ name: `${i.user.username} VS ${i.options.getUser('user').username}` })
			.setTitle(`${i.options.getUser('user').username} won the game!`)
			.setColor('DarkGreen')
			.setDescription(`${game[1][1].fill}${game[1][2].fill}${game[1][3].fill}\n${game[2][1].fill}${game[2][2].fill}${game[2][3].fill}\n${game[3][1].fill}${game[3][2].fill}${game[3][3].fill}`);

		status = transferBal(i.user.id, i.options.getUser('user').id, i.options.getInteger('amount'));
		if (!status) {
			await i2.reply(`${i.options.getUser('user').username} won the game, but an unexpected error occured while attempting to transfer points, so no ProCraft Points were transferred. **Please send a screenshot of this error to ProCraftGamin!**\nError: transferBal returned null.`);
		} else {
			await i2.edit({ embeds: [embed], components: [] });
		}

		game = {
			running: false,
			turn: 0,
			1: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			2: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			3: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
		};
		break;
	case game[1][1].X && game[1][2].X && game[1][3].X:
		embed = new EmbedBuilder()
			.setAuthor({ name: `${i.user.username} VS ${i.options.getUser('user').username}` })
			.setTitle(`${i.user.username} won the game!`)
			.setColor('DarkGreen')
			.setDescription(`${game[1][1].fill}${game[1][2].fill}${game[1][3].fill}\n${game[2][1].fill}${game[2][2].fill}${game[2][3].fill}\n${game[3][1].fill}${game[3][2].fill}${game[3][3].fill}`);

		status = transferBal(i.options.getUser('user').id, i.user.id, i.options.getInteger('amount'));
		if (!status) {
			await i2.reply(`${i.user.username} won the game, but the balance wasn't transferred. **Please send a screenshot of this error to ProCraftGamin!**\nError: transferBal returned null.`);
		} else {
			await i2.edit({ embeds: [embed], components: [] });
		}

		game = {
			running: false,
			turn: 0,
			1: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			2: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			3: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
		};
		break;
	case game[1][1].O && game[1][2].O && game[1][3].O:
		embed = new EmbedBuilder()
			.setAuthor({ name: `${i.user.username} VS ${i.options.getUser('user').username}` })
			.setTitle(`${i.options.getUser('user').username} won the game!`)
			.setColor('DarkGreen')
			.setDescription(`${game[1][1].fill}${game[1][2].fill}${game[1][3].fill}\n${game[2][1].fill}${game[2][2].fill}${game[2][3].fill}\n${game[3][1].fill}${game[3][2].fill}${game[3][3].fill}`);

		status = transferBal(i.user.id, i.options.getUser('user').id, i.options.getInteger('amount'));
		if (!status) {
			await i2.reply(`${i.options.getUser('user').username} won the game, but an unexpected error occured while attempting to transfer points, so no ProCraft Points were transferred. **Please send a screenshot of this error to ProCraftGamin!**\nError: transferBal returned null.`);
		} else {
			await i2.edit({ embeds: [embed], components: [] });
		}

		game = {
			running: false,
			turn: 0,
			1: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			2: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			3: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
		};
		break;
	case game[2][1].X && game[2][2].X && game[2][3].X:
		embed = new EmbedBuilder()
			.setAuthor({ name: `${i.user.username} VS ${i.options.getUser('user').username}` })
			.setTitle(`${i.user.username} won the game!`)
			.setColor('DarkGreen')
			.setDescription(`${game[1][1].fill}${game[1][2].fill}${game[1][3].fill}\n${game[2][1].fill}${game[2][2].fill}${game[2][3].fill}\n${game[3][1].fill}${game[3][2].fill}${game[3][3].fill}`);

		status = transferBal(i.options.getUser('user').id, i.user.id, i.options.getInteger('amount'));
		if (!status) {
			await i2.reply(`${i.user.username} won the game, but the balance wasn't transferred. **Please send a screenshot of this error to ProCraftGamin!**\nError: transferBal returned null.`);
		} else {
			await i2.edit({ embeds: [embed], components: [] });
		}

		game = {
			running: false,
			turn: 0,
			1: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			2: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			3: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
		};
		break;
	case game[2][1].O && game[2][2].O && game[2][3].O:
		embed = new EmbedBuilder()
			.setAuthor({ name: `${i.user.username} VS ${i.options.getUser('user').username}` })
			.setTitle(`${i.options.getUser('user').username} won the game!`)
			.setColor('DarkGreen')
			.setDescription(`${game[1][1].fill}${game[1][2].fill}${game[1][3].fill}\n${game[2][1].fill}${game[2][2].fill}${game[2][3].fill}\n${game[3][1].fill}${game[3][2].fill}${game[3][3].fill}`);

		status = transferBal(i.user.id, i.options.getUser('user').id, i.options.getInteger('amount'));
		if (!status) {
			await i2.reply(`${i.options.getUser('user').username} won the game, but an unexpected error occured while attempting to transfer points, so no ProCraft Points were transferred. **Please send a screenshot of this error to ProCraftGamin!**\nError: transferBal returned null.`);
		} else {
			await i2.edit({ embeds: [embed], components: [] });
		}

		game = {
			running: false,
			turn: 0,
			1: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			2: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			3: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
		};
		break;
	case game[3][1].X && game[3][2].X && game[3][3].X:
		embed = new EmbedBuilder()
			.setAuthor({ name: `${i.user.username} VS ${i.options.getUser('user').username}` })
			.setTitle(`${i.user.username} won the game!`)
			.setColor('DarkGreen')
			.setDescription(`${game[1][1].fill}${game[1][2].fill}${game[1][3].fill}\n${game[2][1].fill}${game[2][2].fill}${game[2][3].fill}\n${game[3][1].fill}${game[3][2].fill}${game[3][3].fill}`);

		status = transferBal(i.options.getUser('user').id, i.user.id, i.options.getInteger('amount'));
		if (!status) {
			await i2.reply(`${i.user.username} won the game, but the balance wasn't transferred. **Please send a screenshot of this error to ProCraftGamin!**\nError: transferBal returned null.`);
		} else {
			await i2.edit({ embeds: [embed], components: [] });
		}

		game = {
			running: false,
			turn: 0,
			1: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			2: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			3: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
		};
		break;
	case game[3][1].O && game[3][2].O && game[3][3].O:
		embed = new EmbedBuilder()
			.setAuthor({ name: `${i.user.username} VS ${i.options.getUser('user').username}` })
			.setTitle(`${i.options.getUser('user').username} won the game!`)
			.setColor('DarkGreen')
			.setDescription(`${game[1][1].fill}${game[1][2].fill}${game[1][3].fill}\n${game[2][1].fill}${game[2][2].fill}${game[2][3].fill}\n${game[3][1].fill}${game[3][2].fill}${game[3][3].fill}`);

		status = transferBal(i.user.id, i.options.getUser('user').id, i.options.getInteger('amount'));
		if (!status) {
			await i2.reply(`${i.options.getUser('user').username} won the game, but an unexpected error occured while attempting to transfer points, so no ProCraft Points were transferred. **Please send a screenshot of this error to ProCraftGamin!**\nError: transferBal returned null.`);
		} else {
			await i2.edit({ embeds: [embed], components: [] });
		}

		game = {
			running: false,
			turn: 0,
			1: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			2: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
			3: {
				1: {
					fill: '⬛',
					X: false,
					O: false,
				},
				2: {
					fill: '⬛',
					X: false,
					O: false,
				},
				3: {
					fill: '⬛',
					X: false,
					O: false,
				},
			},
		};
		break;
	default:

		if ((game[1][1].O || game[1][1].X) && (game[1][2].O || game[1][2].X) && (game[1][3].O || game[1][3].X) && (game[2][1].O || game[2][1].X) && (game[2][2].O || game[2][2].X) && (game[2][3].O || game[2][3].X) && (game[3][1].O || game[3][1].X) && (game[3][2].O || game[3][2].X) && (game[3][3].O || game[3][3].X)) {
			embed = new EmbedBuilder()
				.setColor('DarkRed')
				.setAuthor({ name: `${i.user.username} VS ${i.options.getUser('user').username}` })
				.setTitle('Nobody won. All points have been returned.')
				.setDescription(`${game[1][1].fill}${game[1][2].fill}${game[1][3].fill}\n${game[2][1].fill}${game[2][2].fill}${game[2][3].fill}\n${game[3][1].fill}${game[3][2].fill}${game[3][3].fill}`);


			let row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('c|rematch')
						.setLabel('Rematch? 0/2')
						.setStyle(ButtonStyle.Success),
				);


			await i2.edit({ components: [row], embeds: [embed] }).then(message => {
				// user 1 = interaction user, 2 is challenged user
				let user1RM = false;
				let user2RM = false;

				const filter = (f) => f.isButton && f.user.id == i.user.id || f.user.id == i.options.getUser('user').id;
				const collector = message.createMessageComponentCollector({ filter, time: 60000 });

				collector.on('collect', async (c) => {
					c.deferUpdate();

					if (c.user.id == i.user.id && !user1RM) {
						user1RM = true;
					} else if (c.user.id == i.options.getUser('user').id && !user2RM) {
						user2RM = true;
					}
					if (user1RM || user2RM) {
						row = new ActionRowBuilder()
							.addComponents(
								new ButtonBuilder()
									.setCustomId('c|rematch')
									.setLabel('Rematch? 1/2')
									.setStyle(ButtonStyle.Success),
							);
						await message.edit({ embeds: [embed], components: [row] });
					}
					if (user1RM && user2RM) {
						collector.stop();
						message.edit({ embeds: [embed], components: [] });
						const loadingEmbed = new EmbedBuilder().setTitle('Loading...').setColor('Blue');
						i.channel.send({ embeds: [loadingEmbed] }).then(m => {
							executeGame(i, m);
						});

					}

				});
				collector.on('end', async (c) => {
					if (c.size == 0) {
						await message.edit({ embeds: [embed], components: [] });
					}
				});
			});

			game = {
				turn: 1,
				1: {
					1: {
						fill: '⬛',
						X: false,
						O: false,
					},
					2: {
						fill: '⬛',
						X: false,
						O: false,
					},
					3: {
						fill: '⬛',
						X: false,
						O: false,
					},
				},
				2: {
					1: {
						fill: '⬛',
						X: false,
						O: false,
					},
					2: {
						fill: '⬛',
						X: false,
						O: false,
					},
					3: {
						fill: '⬛',
						X: false,
						O: false,
					},
				},
				3: {
					1: {
						fill: '⬛',
						X: false,
						O: false,
					},
					2: {
						fill: '⬛',
						X: false,
						O: false,
					},
					3: {
						fill: '⬛',
						X: false,
						O: false,
					},
				},
			};
		} else {
			if (game.turn == 0) {
				// embed for when its the user who used the command's turn
				embed = new EmbedBuilder()
					.setAuthor({ name: `${i.user.username} VS ${i.options.getUser('user').username}` })
					.setTitle(`${game[1][1].fill}${game[1][2].fill}${game[1][3].fill}\n${game[2][1].fill}${game[2][2].fill}${game[2][3].fill}\n${game[3][1].fill}${game[3][2].fill}${game[3][3].fill}`)
					.setDescription(`It is currently ${i.user.username}'s turn`);
				// first row
				row0 = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('c|X1.1')
							.setLabel('❌')
							.setDisabled(game[1][1].X || game[1][1].O)
							.setStyle(ButtonStyle.Danger),
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId('c|X1.2')
							.setLabel('❌')
							.setDisabled(game[1][2].X || game[1][2].O)
							.setStyle(ButtonStyle.Danger),
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId('c|X1.3')
							.setLabel('❌')
							.setDisabled(game[1][3].X || game[1][3].O)
							.setStyle(ButtonStyle.Danger),
					);

				// row 2
				row1 = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('c|X2.1')
							.setLabel('❌')
							.setDisabled(game[2][1].X || game[2][1].O)
							.setStyle(ButtonStyle.Danger),
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId('c|X2.2')
							.setLabel('❌')
							.setDisabled(game[2][2].X || game[2][2].O)
							.setStyle(ButtonStyle.Danger),
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId('c|X2.3')
							.setLabel('❌')
							.setDisabled(game[2][3].X || game[2][3].O)
							.setStyle(ButtonStyle.Danger),
					);

				// row 3
				row2 = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('c|X3.1')
							.setLabel('❌')
							.setDisabled(game[3][1].X || game[3][1].O)
							.setStyle(ButtonStyle.Danger),
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId('c|X3.2')
							.setLabel('❌')
							.setDisabled(game[3][2].X || game[3][2].O)
							.setStyle(ButtonStyle.Danger),
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId('c|X3.3')
							.setLabel('❌')
							.setDisabled(game[3][3].X || game[3][3].O)
							.setStyle(ButtonStyle.Danger),
					);


			} else if (game.turn == 1) {
				// embed for when its the challenged user's turn
				embed = new EmbedBuilder()
					.setAuthor({ name: `${i.user.username} VS ${i.options.getUser('user').username}` })
					.setTitle(`${game[1][1].fill}${game[1][2].fill}${game[1][3].fill}\n${game[2][1].fill}${game[2][2].fill}${game[2][3].fill}\n${game[3][1].fill}${game[3][2].fill}${game[3][3].fill}`)
					.setDescription(`It is currently ${i.options.getUser('user').username}'s turn`);

				// first row
				row0 = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('c|O1.1')
							.setLabel('⭕')
							.setDisabled(game[1][1].X || game[1][1].O)
							.setStyle(ButtonStyle.Primary),
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId('c|O1.2')
							.setLabel('⭕')
							.setDisabled(game[1][2].X || game[1][2].O)
							.setStyle(ButtonStyle.Primary),
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId('c|O1.3')
							.setLabel('⭕')
							.setDisabled(game[1][3].X || game[1][3].O)
							.setStyle(ButtonStyle.Primary),
					);

				// row 2
				row1 = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('c|O2.1')
							.setLabel('⭕')
							.setDisabled(game[2][1].X || game[2][1].O)
							.setStyle(ButtonStyle.Primary),
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId('c|O2.2')
							.setLabel('⭕')
							.setDisabled(game[2][2].X || game[2][2].O)
							.setStyle(ButtonStyle.Primary),
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId('c|O2.3')
							.setLabel('⭕')
							.setDisabled(game[2][3].X || game[2][3].O)
							.setStyle(ButtonStyle.Primary),
					);

				// row 3
				row2 = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('c|O3.1')
							.setLabel('⭕')
							.setDisabled(game[3][1].X || game[3][1].O)
							.setStyle(ButtonStyle.Primary),
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId('c|O3.2')
							.setLabel('⭕')
							.setDisabled(game[3][2].X || game[3][2].O)
							.setStyle(ButtonStyle.Primary),
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId('c|O3.3')
							.setLabel('⭕')
							.setDisabled(game[3][3].X || game[3][3].O)
							.setStyle(ButtonStyle.Primary),
					);
			}
			await i2.edit({ content: '', embeds: [embed], components: [row0, row1, row2] }).then(message => {
				let filter = '';
				if (game.turn == 0) {
					filter = (f) => f.isButton() && f.user.id == i.user.id;
				}
				else if (game.turn == 1) {
					filter = (f) => f.isButton() && f.user.id == i.options.getUser('user').id;
				}
				const collector = message.createMessageComponentCollector({ filter, time: 60000 });


				collector.on('collect', async (c) => {
					if (c.customId[2] == 'X') {
						game[c.customId[3]][c.customId[5]].X = true;
						game[c.customId[3]][c.customId[5]].fill = '❌';
					} else if (c.customId[2] == 'O') {
						game[c.customId[3]][c.customId[5]].O = true;
						game[c.customId[3]][c.customId[5]].fill = '⭕';
					}

					if (game.turn == 0) {
						game.turn = 1;
					} else if (game.turn == 1) {
						game.turn = 0;
					}

					c.deferUpdate();
					collector.stop();
					executeGame(i, i2);

				});

				collector.on('end', async (collected) => {
					if (collected.size == 0) {
						if (game.turn == 0) {
							transferBal(i.user.id, i.options.getUser('user').id, i.options.getInteger('amount'));
							embed = new EmbedBuilder()
								.setTitle(`${i.user.username} did not make a move in time, so the game has ended. ${i.options.getInteger('amount')} ProCraft Points have been given to ${i.options.getUser('user').username}.`)
								.setColor('DarkRed');
							// eslint-disable-next-line no-shadow
							i2.reply({ embeds: [embed], ephemeral: true }).then(async message => {
								await wait(60000);
								message.delete;
								i2.delete();
							});


						} else if (game.turn == 1) {
							transferBal(i.options.getUser('user').id, i.user.id, i.options.getInteger('amount'));
							embed = new EmbedBuilder()
								.setTitle(`${i.options.getUser('user').username} did not make a move in time, so the game has ended. ${i.options.getInteger('amount')} ProCraft Points have been given to ${i.user.username}.`)
								.setColor('DarkRed');
							// eslint-disable-next-line no-shadow
							i2.reply({ embeds: [embed], ephemeral: true }).then(async message => {
								await wait (60000);
								message.delete();
								i2.delete();
							});

						}

					}
				});
			});
		}
	}
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tictactoe')
		.setDescription('Challenge someone to a game of Tic Tac Toe!')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to challenge to a game!')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('The amount of ProCraft Points to bet with the person you are challenging!')
				.setRequired(true)),
	async execute(interaction) {
		if (game.running) {
			const embed = new EmbedBuilder()
				.setTitle('Another game is currently in progress. Please wait for it to finish!')
				.setColor('DarkRed');

			await interaction.reply({ embeds: [embed], ephemeral: true });
		} else {
			game.turn = Math.round(Math.random());
			const user1Bal = getBal(interaction.user.id);
			const user2Bal = getBal(interaction.options.getUser('user').id);
			if (!user1Bal || user1Bal < interaction.options.getInteger('amount')) {
				const embed = new EmbedBuilder()
					.setColor('DarkRed')
					.setTitle('You don\'t have enough for this bet!');
				await interaction.reply({ embeds: [embed], ephemeral: true });
			} else if (!user2Bal || user2Bal < interaction.options.getInteger('amount')) {
				const embed = new EmbedBuilder()
					.setColor('DarkRed')
					.setTitle(`${interaction.options.getUser('user').username} doesn't have enough for this bet!`);
				await interaction.reply({ embeds: [embed], ephemeral: true });
			} else {
				// 1 is user who used the command, 2 is the user they challenged
				let embed = new EmbedBuilder()
					.setTitle(`${interaction.user.username} is challenging you to a game of Tic tac toe for ${interaction.options.getInteger('amount')} ProCraft Points!`)
					.setDescription('Use the button below to accept!\nIf you do not accept within 60 seconds, the game will be cancelled.')
					.setColor('DarkRed');

				const row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('c|accept')
							.setLabel('Accept')
							.setStyle(ButtonStyle.Success),
					);

				const filter = (int) => int.user.id == interaction.options.getUser('user').id && int.customId == 'c|accept';

				await interaction.reply({ content: `${interaction.options.getUser('user')}`, embeds: [embed], components: [row] }).then (message => {
					// create a collector for when the accept button is pressed
					const collector = message.createMessageComponentCollector({ filter, time: 60000 });
					// create game embed
					embed = new EmbedBuilder()
						.setAuthor({ name: `${interaction.user.username} VS ${interaction.options.getUser('user').username}` })
						.setDescription(`${game[1][1].fill}${game[1][2].fill}${game[1][3].fill}\n${game[2][1].fill}${game[2][2].fill}${game[2][3].fill}\n${game[3][1].fill}${game[3][2].fill}${game[3][3].fill}`)
						.setTitle(`It is currently ${interaction.user.username}'s turn`);

					// if the user accepts edit the message to have the embed of the game
					collector.on('collect', async () => {
						await interaction.deleteReply();
						game.running = true;
						const loadingEmbed = new EmbedBuilder().setTitle('Loading...').setColor('Blue');
						interaction.channel.send({ embeds: [loadingEmbed] }).then(async i0 => {
							await executeGame(interaction, i0);
						});

					},
					collector.on('end', async (collected) => {
						if (collected.size == 0) {
							embed = new EmbedBuilder()
								.setTitle(`${interaction.options.getUser('user').username} did not accept in time, so the game has been cancelled.`)
								.setColor('DarkRed');
							interaction.followUp({ embeds: [embed], ephemeral: true });
							interaction.deleteReply();
						}
					}),
					);
				});


			}
		}
	},
};