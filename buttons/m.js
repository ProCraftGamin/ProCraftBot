/* eslint-disable no-case-declarations */
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { logChannel } = require('../config.json');
const { sendToWii } = require('../data/private functions.js');
const { removeBal } = require('../data/arcade utils.js');
const fs = require('fs');
let logEmbed = '';
const watermark = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setDisabled(true)
			.setLabel('Sent from server: ProCraftDiscord')
			.setStyle(ButtonStyle.Secondary)
			.setCustomId('subscribe to procraftgamin'),
	);

const moderatorActions = async (interaction) => {
	const buttonIdSplit = interaction.customId.split('|');
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
				await interaction.client.channels.fetch('1050171560167743648').send({ embeds: [returnEmbed], components: [watermark], content: `<@${buttonIdSplit[3]}>` }).then(async message => {
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
				await interaction.client.channels.fetch('1050171560167743648').send({ embeds: [returnEmbed], components: [watermark], content: `<@${buttonIdSplit[3]}>` }).then(async message => {
					await wait(60000),
					await message.delete();
				});

			}
			logEmbed = new EmbedBuilder()
				.setColor('DarkRed')
				.setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.username })
				.setDescription(`Denied ${gMember.user.username}'s request to change their nickname to *"${buttonIdSplit[4]}"*`);

		}
		await interaction.client.channels.fetch(logChannel).send({ embeds: [logEmbed] });
		break;

	case 'msg':
		if (interaction.user.id == buttonIdSplit[3]) {
			interaction.reply({ content: 'You cannot approve/deny your own request!', ephemeral: true });
		} else {

			const requestsJson = fs.readFileSync('data/pending.json');
			const requests = JSON.parse(requestsJson);
			interaction.message.delete();
			interaction.deferUpdate();
			// id format: m|msg|(A/D)|(user id)
			const gm = await interaction.guild.members.fetch({ user: buttonIdSplit[3], force: true });
			if (buttonIdSplit[2] == 'a') {
				const returnEmbed = new EmbedBuilder()
					.setColor('DarkGreen')
					.setTitle('Moderators have approved your request to send')
					.setDescription(`"${requests.shop.item1[gm.user.id]}" to Pro's Wii! It should be sent within the next 24 hours.`);
				try {
					await gm.user.send({ embeds: [returnEmbed] });
				} catch (error) {
					console.error(error);
				}
				removeBal(gm.id, 1000);
				sendToWii(requests.shop.item1[gm.user.id], gm.user);
				logEmbed = new EmbedBuilder()
					.setColor('DarkGreen')
					.setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.username })
					.setDescription(`Approved ${gm.user.username}'s request to send *"${requests.shop.item1[gm.user.id]}"* to Pro's Wii.`);
				delete requests.shop.item1[gm.user.id];
				fs.writeFileSync('data/pending.json', JSON.stringify(requests, null, 2));
			} else {
				const returnEmbed = new EmbedBuilder()
					.setColor('DarkRed')
					.setTitle('Moderators have denied your request to send')
					.setDescription(`"${requests.shop.item1[gm.user.id]}" to Pro's Wii.`);
				try {
					await gm.user.send({ embeds: [returnEmbed] });
				} catch (error) {
					console.error(error);
				}
				logEmbed = new EmbedBuilder()
					.setColor('DarkRed')
					.setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.username })
					.setDescription(`Denied ${gm.user.username}'s request to send *"${requests.shop.item1[gm.user.id]}"* to Pro's Wii.`);

				delete requests.shop.item1[gm.user.id];
				fs.writeFileSync('data/pending.json', JSON.stringify(requests, null, 2));
			}
			const channel = await interaction.client.channels.fetch(logChannel);
			await channel.send({ embeds: [logEmbed] });
		}
	}};

module.exports = moderatorActions;