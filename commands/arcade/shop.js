/* eslint-disable no-case-declarations */
const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getBal } = require('../../data/arcade functions');
const { logChannel } = require('../../config.json');
const fs = require('fs');
const path = require('path');
let row = '';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Spend your ProCraft Points on various things!'),
	async execute(interaction) {
		const logsChannel = await interaction.client.channels.fetch(logChannel);

		// defer update to give things time to load
		let m = null;
		await interaction.deferReply({ ephemeral: true }).then(message => {
			m = message;
		});

		// get users bal
		let bal = await getBal(interaction.user.id);

		// if the user doesnt any balance set it to 0
		if (!bal) bal = 0;


		// create a function that contains everything so its easy to restart
		const execute = async () => {
			// parse json for pending requests
			const pendingJson = fs.readFileSync('data/data.json');
			const pending = JSON.parse(pendingJson);

			// update user's balance
			bal = await getBal(interaction.user.id);

			// create embed and select menu
			let embed = new EmbedBuilder()
				.setColor('Blue')
				.setAuthor({ name: `${interaction.user.displayName}, you have ${bal} ProCraft Points`, iconURL: interaction.user.displayAvatarURL() })
				.setTitle('Welcome to the ProCraft Points shop!')
				.setDescription('Select something from the menu below to learn more about an item!');

			const selectMenu = new StringSelectMenuBuilder()
				.setCustomId('items')
				.setPlaceholder('Select an item to learn more!')
				.setMaxValues(1)
				.setMinValues(1);

			fs.readdirSync(path.join(__dirname, '../../data/shop')).forEach((file) => {
				if (file != undefined && file != '.DS_Store') {
					const fileData = require(path.join(__dirname, '../../data/shop/', file));
					if (fileData.enabled) {
						selectMenu.addOptions([{ label: fileData.fields.selectMenu.label + ` (${fileData.cost} points)`, description: fileData.fields.selectMenu.description, value: fileData.fields.selectMenu.value }]);
					}
				}
			});

			const menu = new ActionRowBuilder()
				.addComponents(
					selectMenu,
				);

			// send the embed to the user then create a collector for the select menu
			await interaction.editReply({ content: '', embeds: [embed], components: [menu] }).then(message => {
				let filter = (f) => f.isStringSelectMenu() && f.user.id == interaction.user.id;
				let collector = message.createMessageComponentCollector({ filter, time: 900000 });

				// when someone presses a button
				collector.on('collect', async (c) => {
					c.deferUpdate();

					const item = require(path.join(__dirname, '../../data/shop/', c.values[0] + '.js'));

					embed = new EmbedBuilder()
						.setAuthor({ name: `${interaction.user.displayName}, you have ${bal} ProCraft Points`, iconURL: interaction.user.displayAvatarURL() })
						.setColor('Blue')
						.setTitle(item.fields.expandedView.title)
						.setDescription(item.fields.expandedView.description);

					if (item.requestQueue == true) {
						if (pending.shop[item.fields.selectMenu.value][interaction.user.id] != null) {
							embed.addFields(
								{ name: 'Cost', value: `${item.cost} <:procraftpoint:1149179916466790441>` },
								{ name: '‼ You already have a message request open!', value: 'Please open a ticket if you would like to cancel it!' },
							);
						}
					} else if (bal < item.cost) {
						embed.addFields(
							{ name: 'Cost', value: `${item.cost} <:procraftpoint:1149179916466790441>` },
							{ name: '‼️ You don\'t have enough to buy this!', value: `${bal} <:procraftpoint:1149179916466790441>/${item.cost} <:procraftpoint:1149179916466790441>` },
						);
					} else {
						embed.addFields(
							{ name: 'Cost', value: `${item.cost} <:procraftpoint:1149179916466790441>` },
						);
					}

					const button = new ButtonBuilder()
						.setStyle(ButtonStyle.Success)
						.setLabel('🛒 Purchase')
						.setCustomId('c|purchase');

					item.requestQueue == true ? button.setDisabled(bal < item.cost || pending.shop[item.fields.selectMenu.value][interaction.user.id] != null) : button.setDisabled(bal < item.cost);

					row = new ActionRowBuilder()
						.addComponents(
							new ButtonBuilder()
								.setStyle(ButtonStyle.Primary)
								.setLabel('🔙 Back')
								.setCustomId('c|back'),
						)
						.addComponents(button);

					await interaction.editReply({ content: '', embeds: [embed], components: [row] });
					collector.stop();

					filter = (f) => f.isButton() && f.user.id == interaction.user.id;
					collector = message.createMessageComponentCollector({ filter, time: 900000 });

					collector.on('collect', async (c2) => {
						c2.deferUpdate();
						switch (c2.customId) {
						case 'c|back':
							execute();
							break;

						case 'c|purchase':
							if (!item.requestQueue) {
								embed = new EmbedBuilder()
									.setColor('DarkGreen')
									.setAuthor({ name: `${interaction.user.displayName} bought ${item.fields.selectMenu.label}`, iconURL: interaction.user.displayAvatarURL() });

								await logsChannel.send({ embeds: [embed] });
							}
							item.execute(interaction, m);
							break;
						}
					});
				});
			});
		};
		execute();
	},
};