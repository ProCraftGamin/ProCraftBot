const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { moderatorChannel, guildId } = require('../../config.json');
const wait = require('node:timers/promises').setTimeout;
const fs = require('fs');
const path = require('path');

let embed = null;
let row = null;

const messageQuery = async (m, c, i) => {

	embed = new EmbedBuilder()
		.setColor('Blue')
		.setTitle('Send what you want to send to my Wii!')
		.setDescription('• *Please remember to keep your message within server and stream rules*\n• *All messages will be reviewed by moderators before being sent*\n• *Your points will be refunded if moderators decline your request*');

	await m.edit({ embeds: [embed], components: [] });

	let filter = (f) => f.author.id == i.user.id;
	let collector = m.channel.createMessageCollector({ filter, time: 600000 });

	collector.on('collect', async (collected) => {
		collector.stop();
		embed = new EmbedBuilder()
			.setColor('Blue')
			.setAuthor({ name: 'Send a message to my Wii', iconURL: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fcreazilla.com%2Fnodes%2F52865-incoming-envelope-emoji-clipart&psig=AOvVaw2f0cqZKDFDBAi70QyAAx8n&ust=1697862011805000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCOjxsITjg4IDFQAAAAAdAAAAABAI' })
			.setDescription(`**You typed** ${collected.content}\n\nWould you like to send this?`);

		row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Secondary)
					.setLabel('🔄 Redo')
					.setCustomId('c|redo'),
			)
			.addComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Success)
					.setLabel('✓ Confirm')
					.setCustomId('c|confirm'),
			);

		await m.channel.send({ embeds: [embed], components: [row], ephemeral: true }).then(msg => {
			m.delete();
			filter = (f) => f.user.id == i.user.id && f.isButton();
			collector = m.channel.createMessageComponentCollector({ filter, time: 300000 });

			collector.on('collect', async (c2) => {
				c2.deferUpdate();
				switch (c2.customId) {
				case 'c|redo':
					messageQuery(msg, c, i);
					break;

				case 'c|confirm':
					embed = new EmbedBuilder()
						.setColor('DarkGreen')
						.setAuthor({ name: `${i.user.displayName} has requested to send`, iconURL: i.user.displayAvatarURL() })
						.setDescription(`"**${collected.content}**" to Pro's Wii`);

					row = new ActionRowBuilder()
						.addComponents(
							new ButtonBuilder()
								.setStyle(ButtonStyle.Success)
								.setLabel('✓ Accept')
								.setCustomId(`m|msg|a|${i.user.id}`),
						)
						.addComponents(
							new ButtonBuilder()
								.setStyle(ButtonStyle.Danger)
								.setLabel('❌ Deny')
								.setCustomId(`m|msg|d|${i.user.id}`),
						);

					await i.client.channels.fetch(moderatorChannel).then(async (channel) => {
						await channel.send({ embeds: [embed], components: [row] });
					});

					// eslint-disable-next-line no-case-declarations
					const dataFile = JSON.parse(fs.readFileSync(path.join(__dirname, '../data.json')));
					dataFile.shop.sendWiiMessage[i.user.id] = collected.content;
					await wait(100);
					fs.writeFileSync(path.join(__dirname, '../data.json'), JSON.stringify(dataFile, null, 2));

					embed = new EmbedBuilder()
						.setAuthor({ name: 'Your request has been sent to Moderators.', iconURL: i.user.displayAvatarURL() })
						.setDescription('*It might take up to 24 hours to complete the request.*')
						.setColor('DarkGreen');

					await msg.edit({ embeds: [embed], components: [] });
					await wait(60000);
					if (c) await c.delete();
				}
			});
		});
	});
};

module.exports = {
	fields: {
		selectMenu: {
			label: 'Send a message to my Wii',
			description: 'Send a message to my Wii for me to read on stream!',
			value: 'sendWiiMessage',
		},
		expandedView: {
			title: '📨 Send a message to my Wii',
			description: 'Allows you to send a message to my Wii to read on stream! ***All message requests will have to be approved by moderators before they go through!***',
		},
	},
	cost: 1000,
	requestQueue: true,
	enabled: true,
	async execute(interaction) {


		let sendMessage = null;
		let channel = null;
		try {

			embed = new EmbedBuilder()
				.setColor('Blue')
				.setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: 'Loading message collector...' });
			await interaction.user.send({ embeds: [embed] }).then(async m => {
				embed = new EmbedBuilder()
					.setColor('Gold')
					.setTitle('Please check your DM\'s!');

				await interaction.editReply({ embeds: [embed], components: [] });
				sendMessage = m;
			});

		} catch (error) {

			embed = new EmbedBuilder()
				.setColor('Blue')
				.setAuthor({ name: `Welcome ${interaction.user.displayName}. Loading the message collector...`, iconURL: interaction.user.displayAvatarURL() });

			const guild = await interaction.client.guilds.fetch(guildId);

			channel = await guild.channels.create({
				name: interaction.user.displayName,
				type: ChannelType.GuildText,
				parent: interaction.channel.parentId,
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

			sendMessage = await channel.send({ embeds: [embed] });

			embed = new EmbedBuilder()
				.setColor('Gold')
				.setDescription(`Please go to <#${channel.id}> to continue!`);

			await interaction.editReply({ embeds: [embed], components: [] });
		}

		messageQuery(sendMessage, channel, interaction);
	},

};