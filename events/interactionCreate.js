/* eslint-disable no-fallthrough */
/* eslint-disable no-case-declarations */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable brace-style */
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { logChannel } = require('../config.json');
const { sendToWii } = require('../data/private functions.js');
const { removeBal } = require('../data/arcade utils.js');
const fs = require('fs');
let logEmbed = '';

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {

			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}

		} else if (interaction.isButton()) {
			try {
				const watermark = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setDisabled(true)
							.setLabel('Sent from server: ProCraftDiscord')
							.setStyle(ButtonStyle.Secondary)
							.setCustomId('subscribe to procraftgamin'),
					);
				const member = interaction.member;
				const buttonIdSplit = interaction.customId.split('|');

				switch (true) {
				// role add / remove
				case interaction.customId[0] === 'r' && interaction.customId[1] === '|':
					const roleName = interaction.guild.roles.cache.get(buttonIdSplit[1]).name;
					if (member.roles.cache.some(role => role.id === buttonIdSplit[1])) {
						member.roles.remove(buttonIdSplit[1]);
						interaction.client.users.send(interaction.user, { content: `✅ Successfully removed **${roleName}**`, components: [watermark] });
						interaction.deferUpdate();
						console.log(`${interaction.user.username} removed ${roleName}`);
					} else {
						member.roles.add(buttonIdSplit[1]);
						if (!member.roles.cache.has(buttonIdSplit[2])) {
							member.roles.add(buttonIdSplit[2]);
						}
						interaction.client.users.send(interaction.user, { content: `✅ Successfully added **${roleName}**`, components: [watermark] });
						interaction.deferUpdate();
						console.log(`${interaction.user.username} added ${roleName}`);
					}
					break;

					// events
				case interaction.customId[0] === 'e' && interaction.customId[1] === '|':

					if (member.roles.cache.some(role => role.id == buttonIdSplit[1])) {
						member.roles.remove(buttonIdSplit[1]);
						const embed = new EmbedBuilder()
							.setColor('DarkGreen')
							.setTitle('No worries!')
							.setDescription('You will not be notified when the event starts!');
						interaction.reply({ embeds: [embed], ephemeral: true });
					} else {

						member.roles.add(buttonIdSplit[1]);
						if (!member.roles.cache.has(buttonIdSplit[2])) {
							member.roles.add(buttonIdSplit[2]);
						}
						const embed = new EmbedBuilder()
							.setColor('DarkGreen')
							.setTitle('Thank you for taking interest in the event!')
							.setDescription('You will be notified when it starts!');
						interaction.reply({ embeds: [embed], ephemeral: true });
					}
					break;
					// collector
				case interaction.customId[0] === 'c' && interaction.customId[1] === '|':
					break;
					// moderator actions
				case interaction.customId[0] === 'm' && interaction.customId[1] === '|':
					switch (buttonIdSplit[1]) {
					case 'n':
						interaction.message.delete();
						// buttomIdSplit format: m|n|(A/D)|(user id)|nickname
						const gMember = await interaction.guild.members.fetch({ user: buttonIdSplit[3], force: true });
						if (buttonIdSplit[2].toLowerCase() == 'a') {
							gMember.setNickname(buttonIdSplit[4]);

							const returnEmbed = new EmbedBuilder()
								.setTitle(`Moderators have approved your request to change your nickname to "*${buttonIdSplit[4]}*"! Enjoy the server!`)
								.setColor('DarkGreen');
							interaction.deferUpdate();
							try {
								await gMember.user.send({ embeds: [returnEmbed], components: [watermark] });
							} catch (error) {
								console.error(error);
								await interaction.client.channels.cache.get('1050171560167743648').send({ embeds: [returnEmbed], components: [watermark], content: `<@${buttonIdSplit[3]}>` }).then(async message => {
									await wait(60000),
									await message.delete();
								});
							}
							logEmbed = new EmbedBuilder()
								.setColor('DarkGreen')
								.setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.username })
								.setDescription(`Accepted ${gMember.user.username}'s request to change their nickname to *"${buttonIdSplit[4]}"*`);

						} else if (buttonIdSplit[2].toLowerCase() == 'd') {
							const returnEmbed = new EmbedBuilder()
								.setTitle('Moderators have declined your request to change your nickname.')
								.setColor('DarkRed');
							interaction.deferUpdate();
							try {
								await gMember.user.send({ embeds: [returnEmbed], components: [watermark] });
							} catch (error) {
								await interaction.client.channels.cache.get('1050171560167743648').send({ embeds: [returnEmbed], components: [watermark], content: `<@${buttonIdSplit[3]}>` }).then(async message => {
									await wait(60000),
									await message.delete();
								});

							}
							logEmbed = new EmbedBuilder()
								.setColor('DarkRed')
								.setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.username })
								.setDescription(`Denied ${gMember.user.username}'s request to change their nickname to *"${buttonIdSplit[4]}"*`);

						}
						await interaction.client.channels.cache.get(logChannel).send({ embeds: [logEmbed] });
						break;

					case 'msg':
						if (interaction.user.id == buttonIdSplit[3]) {
							interaction.reply({ content: 'You cannot approve/deny your own request!', ephemeral: true });
						} else {

							const requestsJson = fs.readFileSync('data/pending requests.json');
							const requests = JSON.parse(requestsJson);
							interaction.message.delete();
							interaction.deferUpdate();
							// id format: m|msg|(A/D)|(user id)
							const gm = await interaction.guild.members.fetch({ user: buttonIdSplit[3], force: true });
							if (buttonIdSplit[2] == 'a') {
								const returnEmbed = new EmbedBuilder()
									.setColor('DarkGreen')
									.setTitle(`Moderators have approved your request to send "${requests.item1[gm.user.id]}" to Pro's Wii! It should be sent within the next 24 hours.`);
								try {
									await gm.user.send({ embeds: [returnEmbed] });
								} catch (error) {
									console.error(error);
								}
								removeBal(gm.id, 1000);
								sendToWii(requests.item1[gm.user.id], gm.user);
								logEmbed = new EmbedBuilder()
									.setColor('DarkGreen')
									.setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.username })
									.setDescription(`Approved ${gm.user.username}'s request to send *"${requests.item1[gm.user.id]}"* to Pro's Wii.`);
								delete requests.item1[gm.user.id];
								fs.writeFileSync('data/pending requests.json', JSON.stringify(requests, null, 2));
							} else {
								const returnEmbed = new EmbedBuilder()
									.setColor('DarkRed')
									.setTitle(`Moderators have denied your request to send "${requests.item1[gm.user.id]}" to Pro's Wii.`);
								try {
									await gm.user.send({ embeds: [returnEmbed] });
								} catch (error) {
									console.error(error);
								}
								logEmbed = new EmbedBuilder()
									.setColor('DarkRed')
									.setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.username })
									.setDescription(`Denied ${gm.user.username}'s request to send *"${requests.item1[gm.user.id]}"* to Pro's Wii.`);

								delete requests.item1[gm.user.id];
								fs.writeFileSync('data/pending requests.json', JSON.stringify(requests, null, 2));
							}
							await interaction.client.channels.cache.get(logChannel).send({ embeds: [logEmbed] });
						}
						break;
					}

				default:
					const buttonPress = require(`../buttons/${interaction.customId}.js`);
					buttonPress(member, interaction);
					break;
				}
			} catch (error) {
				console.error(error);
			}

		}
	},
};

