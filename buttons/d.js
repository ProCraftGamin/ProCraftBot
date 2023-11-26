const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
let row = '';
const statuses = [ '‼️ Pending', '⏳ In-Progress', '✅ Fixed (Next Update)', '✅ Fixed ', '❌ Unfixible', '✅ Intentional', '❌ Already reported' ];
const { openTicket } = require('../data/ticket functions');
const watermark = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setDisabled(true)
			.setLabel('Sent from server: ProCraftDiscord')
			.setStyle(ButtonStyle.Secondary)
			.setCustomId('subscribe to procraftgamin'),
	);
/*
‼️ pending - 0
❌ Already reported - 6
✅ intentional - 5
❌ unfixible - 4
⏳ in-progress  - 1
✅ fixed (next update) - 2
✅ fixed - 3
*/

const devActions = async (interaction) => {
	// parse pending json file
	let pending = await fs.readFileSync('data/data.json');
	pending = await JSON.parse(pending);

	// defer update and split button id
	interaction.deferUpdate();
	const buttonIdSplit = interaction.customId.split('|');

	// switch to figure out which action it wants
	switch (buttonIdSplit[1]) {

	// if its a bug report
	case 'bug':
		// switch to find what action is wanted
		switch (buttonIdSplit[3]) {
		case 'status':

			// make select menu
			row = new ActionRowBuilder()
				.addComponents(
					new StringSelectMenuBuilder()
						.setCustomId('newStatus')
						.setPlaceholder('📄 Change status')
						.addOptions(
							{
								label: '❌ Already Reported',
								value: '6',
							},
							{
								label: '✅ Intentional',
								value: '5',
							},
							{
								label: '❌ Unfixible',
								value: '4',
							},
							{
								label: '⏳ In-Progress',
								value: '1',
							},
							{
								label: '✅ Fixed (Next Update)',
								value: '2',
							},
							{
								label: '✅ Fixed',
								value: '3',
							},
						),

				);

			// edit log message to replace button with select menu
			await interaction.message.edit({ components: [row] }).then(message => {

				// create collector for menu
				const collector = message.createMessageComponentCollector({ componentType: ComponentType.StringSelect });

				// when an item is selected
				collector.on('collect', async (c) => {
					collector.stop();
					c.deferUpdate();

					// turn status string into an integer
					const status = Number(c.values[0]);


					// update log embed
					const embed = new EmbedBuilder()
						.setColor('Red')
						.setAuthor({ name: 'Bug report', iconURL: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficon-library.com%2Fimages%2Ficon-bug%2Ficon-bug-14.jpg&f=1&nofb=1&ipt=e06d000dfb247da25c4c17320eb9490fb2059a48693ad9a2e53fd03f2763ff51&ipo=images' })
						.setDescription(`***Description:*** ${pending['bug reports'][buttonIdSplit[2]].description}\n***Replication steps:*** ${pending['bug reports'][buttonIdSplit[2]]['replication-steps']}\n\n***Status:*** *${statuses[status]}*`)
						.setFooter({ text: `Submitted by ${pending['bug reports'][buttonIdSplit[2]].user.username} • Report ID: ${buttonIdSplit[2]}`, iconURL: pending['bug reports'][buttonIdSplit[2]].user.avatar })
						.setTimestamp();

					await interaction.message.edit({ embeds: [embed] });

					// overwrite components in log message
					const defaultRow = new ActionRowBuilder()
						.addComponents(
							new ButtonBuilder()
								.setCustomId(`d|bug|${[buttonIdSplit[2]]}|status`)
								.setLabel('📄 Change status')
								.setStyle(ButtonStyle.Secondary),
							new ButtonBuilder()
								.setCustomId(`d|bug|${[buttonIdSplit[2]]}|ticket`)
								.setLabel('🎫 Open ticket')
								.setStyle(ButtonStyle.Secondary));
					await interaction.message.edit({ components: [defaultRow] });


					// overwrite pending file
					pending['bug reports'][buttonIdSplit[2]].status = status;
					fs.writeFileSync('data/data.json', JSON.stringify(pending, null, 2));

					// if user has notifications on
					if (pending['bug reports'][buttonIdSplit[2]].user.notifications) {

						// create embed
						const dmEmbed = new EmbedBuilder()
							.setColor('DarkGreen')
							.setTitle('Your bug report has been updated!')
							.setDescription(`***Description:*** ${pending['bug reports'][buttonIdSplit[2]].description}\n***Replication steps:*** ${pending['bug reports'][buttonIdSplit[2]]['replication-steps']}\n\n***Status:*** ${statuses[status]}`)
							.setFooter({ text: `ID: ${buttonIdSplit[2]}`, iconURL: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficon-library.com%2Fimages%2Ficon-bug%2Ficon-bug-14.jpg&f=1&nofb=1&ipt=e06d000dfb247da25c4c17320eb9490fb2059a48693ad9a2e53fd03f2763ff51&ipo=images' })
							.setTimestamp();


						// eslint-disable-next-line max-statements-per-line
						try {
							// try sending user a dm and catch if they don't have external DM's enabled
							const user = await interaction.client.users.fetch(pending['bug reports'][buttonIdSplit[2]].user.id);
							await user.send({ embeds: [dmEmbed], components: [watermark] });
						} catch (e) {console.error(e);}
					}
				});
			});

			break;
		case 'ticket':
		// eslint-disable-next-line no-case-declarations
			const id = await openTicket({ userId: pending['bug reports'][buttonIdSplit[2]].user.id, ticket: { title: pending['bug reports'][buttonIdSplit[2]].description, description: pending['bug reports'][buttonIdSplit[2]]['replication-steps'] } }, interaction.client, 'bug', buttonIdSplit[2]);
			await interaction.followUp({ ephemeral: true, content: `*🎫 Ticket created • <#${id}> *` });

			break;

		}
	}
};

module.exports = devActions;

// d|bug|${id}|status
