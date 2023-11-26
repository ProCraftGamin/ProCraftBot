const fs = require('fs');
const path = require('path');
const { getBal, removeBal, addBal, updateStocks } = require('../data/arcade functions.js');
const { guildId } = require('../config.json');
const wait = require('node:timers/promises').setTimeout;
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelType, PermissionFlagsBits, userMention } = require('discord.js');

const managestocks = async (interaction) => {
	// fetch user balance, stock data
	const stockData = await JSON.parse(fs.readFileSync(path.join(__dirname, '../data/data.json'))).stocks;
	let dataFile = await JSON.parse(fs.readFileSync(path.join(__dirname, '../data/data.json')));
	// create variables that will be modified later
	const userstocks = {};
	let embed = '';
	let components = '';
	let collector = null;
	let message = null;
	let channel = null;

	// create embed and buttons
	embed = new EmbedBuilder()
		.setColor('Blue')
		.setDescription('Loading stock menu...')
		.setTimestamp();

	// collector filter
	const filter = (i) => i.user.id === interaction.user.id;

	// try sending a DM to the user, if failed make a private channel and use that
	try {
		// send message and create collector
		message = await interaction.user.send({ embeds: [embed] });
		await interaction.reply({ content: '**Please check your DMs!**', ephemeral: true });

	} catch (error) {
		const stockChannel = await interaction.client.channels.fetch(stockData.channelId);
		const guild = await interaction.client.guilds.fetch(guildId);

		channel = await guild.channels.create({
			name: interaction.user.displayName,
			type: ChannelType.GuildText,
			parent: stockChannel.parentId,
			permissionOverwrites: [
				{
					id: interaction.user.id,
					allow: [PermissionFlagsBits.ViewChannel],
				},
				{
					id: guild.roles.everyone,
					deny: [PermissionFlagsBits.ViewChannel],
				},
			],
		});

		message = await channel.send({ content: userMention(interaction.user.id), embeds: [embed] });
		await interaction.reply({ content: `**Please go to <#${channel.id}>**`, ephemeral: true });
	}


	const manageStockMenu = async () => {
		const userBal = await getBal(interaction.user.id);

		let stockFields = '---**Your stocks**---\n\n';
		for (const stock in stockData) {
			if (stock !== 'messageId' && stock !== 'channelId')
			{if (Object.keys(stockData[stock].owners).includes(interaction.user.id)) {
				userstocks[stock] = { amount: stockData[stock].owners[interaction.user.id].amount, purchaseCost: stockData[stock].owners[interaction.user.id].purchaseCost };
				stockFields += `**${stock}** - *${stockData[stock].owners[interaction.user.id].amount}*\n**Purchased at:** ${stockData[stock].owners[interaction.user.id].purchaseCost}<:procraftpoint:1149179916466790441> each\n**Sell price:** ${stockData[stock].value - (stockData[stock].value / 10)}<:procraftpoint:1149179916466790441> each\n\n`;
			}}
		}

		// if the user doesn't have any stocks
		if (stockFields == '---**Your stocks**---\n\n') {
			stockFields = 'You don\'t own any stocks!\nMaybe you should buy some 👀';
		}

		// create embed and buttons
		embed = new EmbedBuilder()
			.setColor('Blue')
			.setAuthor({ name: `You have ${userBal} ProCraft Points`, iconURL: interaction.user.displayAvatarURL() })
			.setDescription(stockFields)
			.setTimestamp();

		components = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Success)
					.setLabel('💳 Buy stocks')
					.setCustomId('c|buystocks'),

				new ButtonBuilder()
					.setStyle(ButtonStyle.Danger)
					.setDisabled(stockFields == 'You don\'t own any stocks!\nMaybe you should buy some 👀')
					.setLabel('💰 Sell stocks')
					.setCustomId('c|sellstocks'),

				new ButtonBuilder()
					.setStyle(ButtonStyle.Secondary)
					.setLabel('Done')
					.setCustomId('c|done'),
			);

		await message.edit({ embeds: [embed], components: [components] });

		collector = message.createMessageComponentCollector({ filter, time: 600000 });

		collector.on('end', async (collected) => {
			if (!collected) {
				await message.delete();
				if (channel) {
					await channel.delete();
				}
			}
		});

		// when a button is pressed
		collector.on('collect', async (c1) => {
			collector.stop();
			c1.deferUpdate();

			// if the button was to buy stocks
			if (c1.customId == 'c|buystocks') {
				let stockValueString = '';
				// add all stocks to a display variable,
				// along with price and difference from previous price
				for (const stock in stockData) {
					if (stock !== 'channelId' && stock !== 'messageId') {
						let difference = '';

						if (stockData[stock].value > stockData[stock].previous) {
							difference = (stockData[stock].value + stockData[stock].previous) / 2;
							difference = (stockData[stock].value - stockData[stock].previous) / difference;
							difference = Math.floor(difference * 100 * 100) / 100;

							if (difference >= 50) {
								difference = `<:stocksveryup:1154560699452887080> *(+%${difference})*`;
							} else {
								difference = `<:stocksup:1154560672621936650> *(+%${difference})*`;
							}
						} else if (stockData[stock].previous > stockData[stock].value) {
							difference = (stockData[stock].previous + stockData[stock].value) / 2;
							difference = (stockData[stock].previous - stockData[stock].value) / difference;
							difference = Math.floor(difference * 100 * 100) / 100;

							if (difference >= 50) {
								difference = `<:stocksverydown:1154560743010738196> *(-%${difference})*`;
							} else {
								difference = `<:stocksdown:1154560717500977232> *(-%${difference})*`;
							}
						}
						stockValueString += `**${stock}** - ${stockData[stock].value}<:procraftpoint:1149179916466790441> each ${difference}\n`;
					}
				}

				// create embed and select menu
				embed = new EmbedBuilder()
					.setColor('Green')
					.setAuthor({ name: `You have ${userBal} ProCraft Points`, iconURL: interaction.user.displayAvatarURL() })
					.setTitle('Buy stocks')
					.setDescription(`**Please select a stock in the dropdown below.**\n\n${stockValueString}`);

				components = new StringSelectMenuBuilder()
					.setCustomId('stock')
					.setPlaceholder('Select a stock to buy');

				// add each stock to the menu
				for (const stock in stockData) {
					if (stock !== 'channelId' && stock !== 'messageId') {
						components.addOptions(new StringSelectMenuOptionBuilder()
							.setLabel(stock)
							.setDescription(`${stockData[stock].display} - ${(stockData[stock].value / 10) + stockData[stock].value} points each`)
							.setValue(stock));
					}
				}

				// edit message and create collector
				await message.edit({ embeds: [embed], components: [new ActionRowBuilder().addComponents(components)] });
				collector = message.createMessageComponentCollector({ filter, time: 600000 });

				collector.on('end', async (collected) => {
					if (!collected) {
						embed = new EmbedBuilder()
							.setColor('Red')
							.setAuthor({ name: 'Session expired. Please try again' });

						await message.edit({ embeds: [embed], components: [] });

						await wait(10000);
						await message.delete();
					}
				});

				collector.on('collect', async (c2) => {
					collector.stop();
					c2.deferUpdate();

					let difference = '';
					if (stockData[c2.values[0]].value > stockData[c2.values[0]].previous) {
						difference = (stockData[c2.values[0]].value + stockData[c2.values[0]].previous) / 2;
						difference = (stockData[c2.values[0]].value - stockData[c2.values[0]].previous) / difference;
						difference = Math.floor(difference * 100 * 100) / 100;

						if (difference >= 50) {
							difference = `<:stocksveryup:1154560699452887080> *(+%${difference})*`;
						} else {
							difference = `<:stocksup:1154560672621936650> *(+%${difference})*`;
						}
					} else if (stockData[c2.values[0]].previous > stockData[c2.values[0]].value) {
						difference = (stockData[c2.values[0]].previous + stockData[c2.values[0]].value) / 2;
						difference = (stockData[c2.values[0]].previous - stockData[c2.values[0]].value) / difference;
						difference = Math.floor(difference * 100 * 100) / 100;

						if (difference >= 50) {
							difference = `<:stocksverydown:1154560743010738196> *(-%${difference})*`;
						} else {
							difference = `<:stocksdown:1154560717500977232> *(-%${difference})*`;
						}
					}

					embed = new EmbedBuilder()
						.setColor('Green')
						.setAuthor({ name: `You have ${userBal} points`, iconURL: interaction.user.displayAvatarURL() })
						.setTitle(`${c2.values[0]} - ${stockData[c2.values[0]].display} stocks`)
						.setDescription(`**Buy price:** ${Math.floor(stockData[c2.values[0]].value / 10 + stockData[c2.values[0]].value)}<:procraftpoint:1149179916466790441> each ${difference}\n\n**How many stocks would you like to buy?**`)
						.setFooter({ text: 'Please send the amount you would like to buy' });

					await message.edit({ embeds: [embed], components: [] });
					message.channel.awaitMessages({ max: 1, time: 6000000, errors: ['time'] })
						.then(async c3 => {

							if (parseInt(c3.first().content) !== 'NaN') {
								const stockNumber = parseInt(c3.first().content);
								if (stockNumber > 0) {
									embed = new EmbedBuilder()
										.setColor('Green')
										.setAuthor({ name: `You have ${userBal} points`, iconURL: interaction.user.displayAvatarURL() })
										.setTitle(`${c2.values[0]} - ${stockData[c2.values[0]].display}`)
										.setFooter({ text: 'Stock price + %10 tax' });

									if (stockNumber > 1) {
										embed.setDescription(`${stockNumber} stocks will cost you ${Math.floor(((stockData[c2.values[0]].value / 10) + stockData[c2.values[0]].value) * stockNumber)}<:procraftpoint:1149179916466790441>\n*The price of the stock will increase to ${Math.floor(stockData[c2.values[0]].value / 10 + stockData[c2.values[0]].value)}<:procraftpoint:1149179916466790441> each*`);
									} else {
										embed.setDescription(`${stockNumber} stock will cost you ${Math.floor(((stockData[c2.values[0]].value / 10) + stockData[c2.values[0]].value) * stockNumber)}<:procraftpoint:1149179916466790441>\n*The price of the stock will increase to ${Math.floor(stockData[c2.values[0]].value / 10 + stockData[c2.values[0]].value)}<:procraftpoint:1149179916466790441> each*`);
									}

									if (userBal < ((stockData[c2.values[0]].value / 10) + stockData[c2.values[0]].value) * stockNumber) {
										embed.addFields(
											{ name: '‼️ You don\'t have enough points to buy this!', value: `You have ${userBal}<:procraftpoint:1149179916466790441> / ${((stockData[c2.values[0]].value / 10) + stockData[c2.values[0]].value) * stockNumber}<:procraftpoint:1149179916466790441>` },
										);
									}

									components = new ActionRowBuilder()
										.addComponents(
											new ButtonBuilder()
												.setLabel('Cancel')
												.setStyle(ButtonStyle.Secondary)
												.setCustomId('c|back'),

											new ButtonBuilder()
												.setLabel('Buy')
												.setDisabled(userBal < ((stockData[c2.values[0]].value / 10) + stockData[c2.values[0]].value) * stockNumber)
												.setStyle(ButtonStyle.Success)
												.setCustomId('c|confirm'),
										);

									await message.delete();
									await message.channel.send({ embeds: [embed], components: [components] }).then(m2 => {
										message = m2;
									});

									collector = message.createMessageComponentCollector({ filter, time: 600000 });

									collector.on('end', async (collected) => {
										if (!collected) {
											embed = new EmbedBuilder()
												.setColor('Red')
												.setAuthor({ name: 'Session expired. Please try again' });

											await message.edit({ embeds: [embed], components: [] });

											await wait(10000);
											await message.delete();
										}
									});

									collector.on('collect', async (c4) => {
										collector.stop();
										c4.deferUpdate();

										if (c4.customId == 'c|confirm') {
											embed = new EmbedBuilder()
												.setAuthor({ name: 'Processing...' })
												.setColor('Blue');

											await message.edit({ embeds: [embed], components: [] });

											if (stockData[c2.values[0]].owners[interaction.user.id]) {
												stockData[c2.values[0]].owners[interaction.user.id].purchaseCost = (stockData[c2.values[0]].owners[interaction.user.id].purchaseCost + ((stockData[c2.values[0]].value / 10) + stockData[c2.values[0]].value) * stockNumber / stockNumber) / 2;
												stockData[c2.values[0]].owners[interaction.user.id].amount += stockNumber;
											} else {
												stockData[c2.values[0]].owners[interaction.user.id] = {};
												stockData[c2.values[0]].owners[interaction.user.id].purchaseCost = ((stockData[c2.values[0]].value / 10) + stockData[c2.values[0]].value) * stockNumber / stockNumber;
												stockData[c2.values[0]].owners[interaction.user.id].amount = stockNumber;
											}

											dataFile = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/data.json')));
											dataFile.stocks = stockData;
											await wait(100);
											// DO NOT TOUCH THIS LINE SO HELP ME GOD
											fs.writeFileSync(path.join(__dirname, '../data/data.json'), JSON.stringify(dataFile, null, 2));
											await wait(500);
											await updateStocks(c2.values[0], Math.floor(stockData[c2.values[0]].value / 10 + stockData[c2.values[0]].value), 'set', interaction.client);
											await removeBal(interaction.user.id, (Math.floor((stockData[c2.values[0]].value / 10) + stockData[c2.values[0]].value) * stockNumber));

											await wait(500);
											manageStockMenu();
										} else {manageStockMenu(); }
									});
								}
							} else {
								console.log('NaN');
							}
						});

				});
			} else if (c1.customId == 'c|sellstocks') {
				let stockValueString = '';
				// add all stocks to a display variable,
				// along with price and difference from previous price
				for (const stock in stockData) {
					if (stock !== 'channelId' && stock !== 'messageId') {
						let difference = '';

						if (stockData[stock].value > stockData[stock].previous) {
							difference = (stockData[stock].value + stockData[stock].previous) / 2;
							difference = (stockData[stock].value - stockData[stock].previous) / difference;
							difference = Math.floor(difference * 100 * 100) / 100;

							if (difference >= 50) {
								difference = `<:stocksveryup:1154560699452887080> *(+%${difference})*`;
							} else {
								difference = `<:stocksup:1154560672621936650> *(+%${difference})*`;
							}
						} else if (stockData[stock].previous > stockData[stock].value) {
							difference = (stockData[stock].previous + stockData[stock].value) / 2;
							difference = (stockData[stock].previous - stockData[stock].value) / difference;
							difference = Math.floor(difference * 100 * 100) / 100;

							if (difference >= 50) {
								difference = `<:stocksverydown:1154560743010738196> *(-%${difference})*`;
							} else {
								difference = `<:stocksdown:1154560717500977232> *(-%${difference})*`;
							}
						}
						stockValueString += `**${stock}** - ${stockData[stock].value}<:procraftpoint:1149179916466790441> each ${difference}\n`;
					}
				}

				// create embed and select menu
				embed = new EmbedBuilder()
					.setColor('Red')
					.setAuthor({ name: `You have ${userBal} ProCraft Points`, iconURL: interaction.user.displayAvatarURL() })
					.setTitle('Sell stocks')
					.setDescription(`**Please select a stock in the dropdown below.**\n\n${stockValueString}`);

				components = new StringSelectMenuBuilder()
					.setCustomId('stock')
					.setPlaceholder('Select a stock to sell');

				// add each stock to the menu
				for (const stock in stockData) {
					if (stock !== 'channelId' && stock !== 'messageId') {
						if (stockData[stock].owners[interaction.user.id]) {
							components.addOptions(new StringSelectMenuOptionBuilder()
								.setLabel(`${stock} - ${stockData[stock].owners[interaction.user.id].amount}`)
								.setDescription(`${stockData[stock].display} - ${stockData[stock].value - (stockData[stock].value / 10)} points each`)
								.setValue(stock));
						}
					}
				}

				// edit message and create collector
				await message.edit({ embeds: [embed], components: [new ActionRowBuilder().addComponents(components)] });
				collector = message.createMessageComponentCollector({ filter, time: 600000 });

				collector.on('end', async (collected) => {
					if (!collected) {
						embed = new EmbedBuilder()
							.setColor('Red')
							.setAuthor({ name: 'Session expired. Please try again' });

						await message.edit({ embeds: [embed], components: [] });

						await wait(10000);
						await message.delete();
					}
				});

				collector.on('collect', async (c2) => {
					collector.stop();
					c2.deferUpdate();

					let difference = '';
					if (stockData[c2.values[0]].value > stockData[c2.values[0]].previous) {
						difference = (stockData[c2.values[0]].value + stockData[c2.values[0]].previous) / 2;
						difference = (stockData[c2.values[0]].value - stockData[c2.values[0]].previous) / difference;
						difference = Math.floor(difference * 100 * 100) / 100;

						if (difference >= 50) {
							difference = `<:stocksveryup:1154560699452887080> *(+%${difference})*`;
						} else {
							difference = `<:stocksup:1154560672621936650> *(+%${difference})*`;
						}
					} else if (stockData[c2.values[0]].previous > stockData[c2.values[0]].value) {
						difference = (stockData[c2.values[0]].previous + stockData[c2.values[0]].value) / 2;
						difference = (stockData[c2.values[0]].previous - stockData[c2.values[0]].value) / difference;
						difference = Math.floor(difference * 100 * 100) / 100;

						if (difference >= 50) {
							difference = `<:stocksverydown:1154560743010738196> *(-%${difference})*`;
						} else {
							difference = `<:stocksdown:1154560717500977232> *(-%${difference})*`;
						}
					}

					embed = new EmbedBuilder()
						.setColor('Red')
						.setAuthor({ name: `You have ${userBal} points`, iconURL: interaction.user.displayAvatarURL() })
						.setTitle(`${c2.values[0]} - ${stockData[c2.values[0]].display} stocks`)
						.setDescription(`**Sell price:** ${Math.floor(stockData[c2.values[0]].value - stockData[c2.values[0]].value / 10)}<:procraftpoint:1149179916466790441> each ${difference}\n\n**How many stocks would you like to sell?**`)
						.setFooter({ text: 'Please send the amount you would like to sell' });

					await message.edit({ embeds: [embed], components: [] });
					message.channel.awaitMessages({ max: 1, time: 6000000, errors: ['time'] })
						.then(async c3 => {

							if (parseInt(c3.first().content) !== 'NaN') {
								let stockNumber = parseInt(c3.first().content);

								if (stockNumber > 0) {
									if (stockNumber > stockData[c2.values[0]].owners[interaction.user.id].amount) { stockNumber = stockData[c2.values[0]].owners[interaction.user.id].amount; }
									embed = new EmbedBuilder()
										.setColor('Red')
										.setAuthor({ name: `You have ${userBal} points`, iconURL: interaction.user.displayAvatarURL() })
										.setTitle(`${c2.values[0]} - ${stockData[c2.values[0]].display}`)
										.setFooter({ text: 'Stock price - %10 tax' });

									if (stockNumber > 1) {
										embed.setDescription(`${stockNumber} stocks will give you ${Math.floor((stockData[c2.values[0]].value - (stockData[c2.values[0]].value / 10)) * stockNumber)}<:procraftpoint:1149179916466790441>\n*The price of the stock will decrease to ${Math.floor(stockData[c2.values[0]].value - (stockData[c2.values[0]].value / 10))}<:procraftpoint:1149179916466790441> each*`);
									} else {
										embed.setDescription(`${stockNumber} stock will give you ${Math.floor((stockData[c2.values[0]].value - (stockData[c2.values[0]].value / 10)) * stockNumber)}<:procraftpoint:1149179916466790441>\n*The price of the stock will decrease to ${Math.floor(stockData[c2.values[0]].value - (stockData[c2.values[0]].value / 10))}<:procraftpoint:1149179916466790441> each*`);
									}


									components = new ActionRowBuilder()
										.addComponents(
											new ButtonBuilder()
												.setLabel('Cancel')
												.setStyle(ButtonStyle.Secondary)
												.setCustomId('c|back'),

											new ButtonBuilder()
												.setLabel('Sell')
												.setStyle(ButtonStyle.Danger)
												.setCustomId('c|confirm'),
										);

									await message.delete();
									await message.channel.send({ embeds: [embed], components: [components] }).then(m2 => {
										message = m2;
									});

									collector = message.createMessageComponentCollector({ filter, time: 600000 });

									collector.on('end', async (collected) => {
										if (!collected) {
											embed = new EmbedBuilder()
												.setColor('Red')
												.setAuthor({ name: 'Session expired. Please try again' });

											await message.edit({ embeds: [embed], components: [] });

											await wait(10000);
											await message.delete();
										}
									});

									collector.on('collect', async (c4) => {
										collector.stop();
										c4.deferUpdate();

										if (c4.customId == 'c|confirm') {
											embed = new EmbedBuilder()
												.setAuthor({ name: 'Processing...' })
												.setColor('Blue');

											await message.edit({ embeds: [embed], components: [] });

											if (stockNumber == stockData[c2.values[0]].owners[interaction.user.id].amount) {
												delete stockData[c2.values[0]].owners[interaction.user.id];
											} else {
												stockData[c2.values[0]].owners[interaction.user.id].amount -= stockNumber;
											}

											dataFile = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/data.json')));
											dataFile.stocks = stockData;
											await wait(100);
											// DO NOT TOUCH THIS LINE SO HELP ME GOD
											fs.writeFileSync(path.join(__dirname, '../data/data.json'), JSON.stringify(dataFile, null, 2));
											await wait(500);
											await updateStocks(c2.values[0], Math.floor(stockData[c2.values[0]].value - stockData[c2.values[0]].value / 10), 'set', interaction.client);
											await addBal(interaction.user.id, (Math.floor(stockData[c2.values[0]].value - (stockData[c2.values[0]].value / 10)) * stockNumber));
											await wait(500);

											manageStockMenu();
										} else {manageStockMenu(); }
									});
								}
							} else {
								console.log('NaN');
							}
						});

				});
			} else {
				await message.delete();
				if (channel) {
					await channel.delete();
				}
			}
		});
	};
	manageStockMenu();
};

module.exports = managestocks;