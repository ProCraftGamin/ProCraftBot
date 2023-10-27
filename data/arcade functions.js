const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { wordnikToken } = require('../config.json');
const fs = require('fs');
const path = require('path');
const wait = require('node:timers/promises').setTimeout;
const axios = require('axios');

// word streak stuff
let currentStreak = 0;
let currentWord = 'among';
const streakChannel = '';
let lastUser = '';

const getBal = (userId) => {
	const balances = JSON.parse(fs.readFileSync(path.join(__dirname, '/data.json'))).balances;
	if (Object.keys(balances).includes(userId)) { return balances[userId]; }
	return null;
};
const setBal = async (userId, bal) => {
	const balFile = JSON.parse(fs.readFileSync(path.join(__dirname, '/data.json')));

	balFile.balances[userId] = bal;
	// DO NOT DELETE THIS LINE SO HELP ME GOD
	await wait(100);
	fs.writeFileSync(path.join(__dirname, '/data.json'), JSON.stringify(balFile, null, 2));
	return 1;
};

const addBal = (userId, plus) => {
	const balRaw = getBal(userId);
	if (!balRaw) {
		setBal(userId, plus);
		return plus;
	} else {
		let bal = parseInt(balRaw);
		bal = bal += plus;
		setBal(userId, bal);
		return bal;
	}
};

const removeBal = (userId, minus) => {
	const balRaw = getBal(userId);
	if (!balRaw) {
		setBal(userId, '0');
		return minus;
	} else {
		let bal = parseInt(balRaw);
		bal -= minus;
		setBal(userId, bal);
		return bal;
	}
};

const transferBal = async (user1Id, user2Id, amount) => {
	let status = removeBal(user1Id, amount);
	if (!status) {
		return null;
	}
	await wait(1000);
	status = addBal(user2Id, amount);
	if (!status) {
		addBal(user1Id, amount);
		return null;
	}
	return 1;
};

const checkStockInactivity = async (client) => {
	const stockData = JSON.parse(fs.readFileSync(path.join(__dirname, '/data.json'))).stocks;

	for (const stock in stockData) {
		if (stock !== 'messageId' && stock !== 'channelId') {
			let lastUpdate = new Date(stockData[stock].updateTime);
			lastUpdate = new Date(lastUpdate.getTime() + 6.048e+8);
			const now = new Date();

			if (now.getTime() > lastUpdate.getTime()) {
				await updateStocks(stock, 100, '-', client);
			}
		}
	}
};

const updateStocks = async (stock, change, operator, client) => {
	const stockData = await JSON.parse(fs.readFileSync(path.join(__dirname, '/data.json'))).stocks;

	if (Object.keys(stockData).includes(stock)) {
		stockData[stock].previous = stockData[stock].value;
		stockData[stock].updateTime = new Date();

		switch (operator) {
		case '+':
			stockData[stock].value += change;
			break;
		case '-':
			stockData[stock].value -= change;
			break;
		case '*':
			stockData[stock].value *= change;
			break;
		case '/':
			stockData[stock].value /= change;
			break;
		case 'set':
			stockData[stock].value = change;
		}
	} else {
		return 404;
	}

	let messageString = '---**Current Stock Prices**---\n\n';

	for (const Stock in stockData) {
		if (Stock != 'messageId' && Stock != 'channelId') {
			let difference = null;

			if (stockData[Stock].value > stockData[Stock].previous) {
				difference = (stockData[Stock].value + stockData[Stock].previous) / 2;
				difference = (stockData[Stock].value - stockData[Stock].previous) / difference;
				difference = Math.floor(difference * 100 * 100) / 100;

				if (difference >= 50) {
					difference = `<:stocksveryup:1154560699452887080> *(+%${difference})*`;
				} else {
					difference = `<:stocksup:1154560672621936650> *(+%${difference})*`;
				}
			} else if (stockData[Stock].previous > stockData[Stock].value) {
				difference = (stockData[Stock].previous + stockData[Stock].value) / 2;
				difference = (stockData[Stock].previous - stockData[Stock].value) / difference;
				difference = Math.floor(difference * 100 * 100) / 100;

				if (difference >= 50) {
					difference = `<:stocksverydown:1154560743010738196> *(-%${difference})*`;
				} else {
					difference = `<:stocksdown:1154560717500977232> *(-%${difference})*`;
				}
			}

			if (difference == null) {
				messageString += `**${Stock}** - *${stockData[Stock].display}*\n**Price:** ${stockData[Stock].value}<:procraftpoint:1149179916466790441> ➖\n\n`;
			} else {
				messageString += `**${Stock}** - *${stockData[Stock].display}*\n**Price:** ${stockData[Stock].value}<:procraftpoint:1149179916466790441> ${difference}\n\n`;
			}
		}
	}

	if (stockData.messageId == null) {
		console.log('No stock channel was found. Set one with "config|stockChannel|(id)');
	} else {
		await client.channels.fetch(stockData.channelId).then(channel => {
			channel.messages.fetch(stockData.messageId).then(message => {
				message.edit({ content: '', embeds: [new EmbedBuilder().setColor('Blue').setDescription(messageString)], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('manageStocks').setLabel('Manage Your Stocks').setStyle(ButtonStyle.Primary))] });
			});
		});
	}
	const dataFile = await JSON.parse(fs.readFileSync(path.join(__dirname, '/data.json')));
	dataFile.stocks = stockData;
	fs.writeFileSync(path.join(__dirname, '/data.json'), JSON.stringify(dataFile, null, 2));
	return 1;
};

const scrambleWord = (word) => {
	const wordTemp = word.split('');
	for (let i = wordTemp.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const tmp = wordTemp[i];
		wordTemp[i] = wordTemp[j];
		wordTemp[j] = tmp;
	}
	const wordNew = wordTemp.join('');
	return wordNew;
};

const unscrambleGame = async (client) => {
	const { arcadeId } = require('../config.json');
	const file = fs.readFileSync(path.join(__dirname, '/unscramble words.txt')).toString().split(/\r\n|\n/);
	const filePos = Math.floor(Math.random() * file.length);

	const wordScrambled = scrambleWord(file[filePos]);
	const amount = wordScrambled.length * 25;
	const initalEmbed = new EmbedBuilder()
		.setTitle(`The first person to unscramble \n"${wordScrambled}" gets ${amount} ProCraft Points!`)
		.setColor('Blue');

	const a = await client.channels.fetch(arcadeId);
	a.send({ embeds: [initalEmbed] }).then(interaction => {
		const filter = m => m.content.toLowerCase().replace(' ', '') === (file[filePos].toLowerCase());
		const collector = interaction.channel.createMessageCollector({ filter, time: 900000 });

		collector.on('collect', async m => {
			const status = addBal(m.author.id, amount);
			if (!status) {
				const newEmbed = new EmbedBuilder()
					.setTitle(`${m.author.username} unscrambled "${m}" first, but hasnt opened an account yet. Therefore, they were not given the points. Open one with /open-acc!`)
					.setColor('DarkRed');
				interaction.channel.send({ embeds: [newEmbed] });
			} else {
				const newEmbed = new EmbedBuilder()
					.setTitle(`${m.author.username} unscrambled "${m}" first!`)
					.setColor('DarkGreen');
				interaction.channel.send({ embeds: [newEmbed] });
			}
			collector.stop();
			await wait (300000);

			unscrambleGame(client);
		});

		collector.on('end', async (collected) => {
			if (collected.size == 0) {
				const endEmbed = new EmbedBuilder()
					.setTitle(`Nobody got the word. The word was "${file[filePos]}".`)
					.setColor('DarkRed');
				interaction.channel.send({ embeds: [endEmbed] });
				await wait(3600000);
				unscrambleGame(client);
			}
		});
	});
};

const updateStreak = async (message) => {
	if (/\s/g.test(message.content)) return;
	if (message.author.id == lastUser) return;
	if (streakChannel == null) {
		console.log('No streak channel defined.');
	} else {
		lastUser = message.author.id;
		await axios
			.get(`https://api.wordnik.com/v4/word.json/${message.content.toString().toLowerCase()}/definitions`, {
				params: {
					api_key: wordnikToken,
				},
			})
			.then(async (response) => {
				if (response.status === 200) {
					if (message.content.toString().toLowerCase() == currentWord) {
						currentStreak = 0;

						await message.react('❌');
					} else if ((message.content[0].toString().toLowerCase() == currentWord[currentWord.length - 1]) || (currentWord == 'among' && message.content.toString().toLowerCase() == 'us')) {
						currentStreak++;
						currentWord = message.content.toString().toLowerCase();

						addBal(message.author.id, (currentStreak * 10));

						await message.react('✅');
					// streak continues
					} else {
						currentStreak = 0;

						await message.react('❌');
						currentWord = message.content.toString().toLowerCase();

					// streak ends because word doesnt start with last letter of last word
					}
				}
			})
			.catch(async (error) => {
				if (error.response.data.statusCode == 404) {
					// text doesnt match a word
					currentStreak = 0;
					await message.react('❌');

				} else if (error.response.status == 429) {
					console.log('Rate limit exceeded');
					await wait(30000);
					updateStreak(message);
				} else {
					console.error(`Error checking if the word exists: ${error.message}`);
					console.log(error);
					console.log(`Status code: ${error.response.data.statusCode}`);
				}
			});
		const channel = await message.client.channels.fetch(message.channelId);
		channel.setTopic(`Last word: ${currentWord} - ${currentStreak} streak`);
	}
};

exports.transferBal = transferBal;
exports.removeBal = removeBal;
exports.addBal = addBal;
exports.getBal = getBal;
exports.setBal = setBal;
exports.checkStockInactivity = checkStockInactivity;
exports.updateStocks = updateStocks;
exports.unscrambleGame = unscrambleGame;
exports.updateStreak = updateStreak;