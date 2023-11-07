const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { guildId, moderatorChannel, spotifyClientId, spotifyClientSecret } = require('../../config.json');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { isLive } = require('../twitch events');
const wait = require('node:timers/promises').setTimeout;
let embed = null;
let collector = null;
let filter = null;
let row = null;
console.log(isLive);

async function getAccessToken() {
	const authHeader = 'Basic ' + Buffer.from(`${spotifyClientId}:${spotifyClientSecret}`).toString('base64');

	const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
		headers: {
			Authorization: authHeader,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	});

	return tokenResponse.data.access_token;
}

const songQuery = async (i, m) => {
	embed = new EmbedBuilder()
		.setColor('Green')
		.setAuthor({ name: 'Spotify Song Request', iconURL: 'http://1000logos.net/wp-content/uploads/2017/08/Spotify-Logo.png' })
		.setTitle('Please send what song you want to search for.')
		.addFields(
			{ name: 'Examples', value: 'Never gonna give you up - rick astley\nVGR toads factory' },
		)
		.setTimestamp();

	await m.edit({ embeds: [embed], components: [] });
	filter = (f) => f.author.id = i.user.id;
	collector = m.channel.createMessageCollector({ filter, time: 300000 });

	collector.on('collect', async (message) => {
		collector.stop();

		embed = new EmbedBuilder()
			.setAuthor({ name: 'Spotify Song Request', iconURL: 'http://1000logos.net/wp-content/uploads/2017/08/Spotify-Logo.png' })
			.setColor('Green')
			.setTitle('Searching...');

		await m.channel.send({ embeds: [embed] }).then(async msg => {
			await m.delete();


			const query = message.content.replace(/ /gi, '%20');
			// Obtain an access token
			const token = await getAccessToken();

			// Set up the headers with the access token
			const headers = {
				Authorization: `Bearer ${token}`,
			};

			// Make a request to the Spotify API to search for tracks
			if (!query) return;
			const response = await axios.get('https://api.spotify.com/v1/search', {
				headers,
				params: {
					q: query,
					type: 'track',
				},
			});
			const tracksList = [];
			const explicitFilteredIndexes = [];
			let executeCount = 0;
			let resultsTemp = '';
			let tempFilteredIndexes = [];
			response.data.tracks.items.forEach((song, index) => {
				if (song.explicit) return;
				resultsTemp += `${executeCount + 1}. **${song.name}** by ${song.artists[0].name}\n`;
				tempFilteredIndexes[executeCount] = index;

				if (executeCount == 9) {
					tracksList.push(resultsTemp);
					explicitFilteredIndexes.push(tempFilteredIndexes);
					executeCount = 0;
					resultsTemp = '';
					tempFilteredIndexes = [];
				} else { executeCount++; }
			});
			if (resultsTemp && tempFilteredIndexes) {
				tracksList.push(resultsTemp);
				explicitFilteredIndexes.push(tempFilteredIndexes);
			}

			const returnPage = async (pageNum, q, m2) => {
				embed = new EmbedBuilder()
					.setColor('Green')
					.setAuthor({ name: 'Spotify Song Request', iconURL: 'http://1000logos.net/wp-content/uploads/2017/08/Spotify-Logo.png' })
					.setFooter({ text: `Page ${pageNum} of ${tracksList.length} • Explicit songs have automagically been filtered out of the search results.` });

				tracksList[0] == undefined ? embed.addFields(
					{ name: `Search Results for **${message.content}**`, value: '**No results were found**' },
				) : embed.addFields(
					{ name: `Search Results for **${message.content}**`, value: `${tracksList[pageNum - 1]}\n\n**Please send the number of the song you would like to pick, or switch page!**` },
				);


				row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setStyle(ButtonStyle.Secondary)
							.setLabel('Previous page')
							.setCustomId('c|previous')
							.setDisabled(pageNum == 1),
					)
					.addComponents(
						new ButtonBuilder()
							.setStyle(ButtonStyle.Secondary)
							.setLabel('Next page')
							.setCustomId('c|next')
							.setDisabled(pageNum == tracksList.length),
					)
					.addComponents(
						new ButtonBuilder()
							.setStyle(ButtonStyle.Secondary)
							.setLabel('Change search')
							.setCustomId('c|change'),
					);

				await m2.edit({ embeds: [embed], components: [row] });


				filter = (f) => f.author.id == i.user.id;
				collector = m2.channel.createMessageCollector({ filter, time: 300000 });
				filter = (f) => f.isButton && f.user.id == i.user.id;
				let componentCollector = m2.createMessageComponentCollector({ filter, time: 300000 });

				componentCollector.on('collect', (c) => {
					componentCollector.stop();
					collector.stop();
					c.deferUpdate();
					switch (c.customId) {
					case 'c|next':
						returnPage(pageNum + 1, q, m2);
						break;
					case 'c|previous':
						returnPage(pageNum - 1, q, m2);
						break;
					case 'c|change':
						songQuery(i, m2);
					}
				});

				collector.on('collect', async (c) => {
					collector.stop();
					componentCollector.stop();

					let number = parseInt(c.content);

					if (!isNaN(number)) {
						if (number - 1 > response.data.tracks.items.length) number = response.data.tracks.items.length + 1;

						embed = new EmbedBuilder()
							.setAuthor({ name: 'Spotify Song Request', iconURL: 'http://1000logos.net/wp-content/uploads/2017/08/Spotify-Logo.png' })
							.setColor('Green')
							.setThumbnail(response.data.tracks.items[explicitFilteredIndexes[pageNum - 1][number - 1]].album.images[0].url)
							.setTitle(response.data.tracks.items[explicitFilteredIndexes[pageNum - 1][number - 1]].name)
							.setURL(response.data.tracks.items[explicitFilteredIndexes[pageNum - 1][number - 1]].external_urls.spotify)
							.setDescription(`**Artist**: ${response.data.tracks.items[explicitFilteredIndexes[pageNum - 1][number - 1]].artists[0].name}\n**Release year:** ${response.data.tracks.items[explicitFilteredIndexes[pageNum - 1][number - 1]].album.release_date.split('-')[0]}`);

						row = new ActionRowBuilder()
							.addComponents(
								new ButtonBuilder()
									.setStyle(ButtonStyle.Secondary)
									.setLabel('Back')
									.setCustomId('c|back'),
							)
							.addComponents(
								new ButtonBuilder()
									.setStyle(ButtonStyle.Success)
									.setLabel('Confirm')
									.setCustomId('c|confirm'),
							);

						await m2.channel.send({ embeds: [embed], components: [row] }).then(async (m3) => {
							await m2.delete();

							componentCollector = m3.createMessageComponentCollector({ filter, time: 300000 });

							componentCollector.on('collect', async (c3) => {
								componentCollector.stop();
								c3.deferUpdate();

								switch (c3.customId) {
								case 'c|back':
									returnPage(pageNum, q, m3);
									break;
								case 'c|confirm':
									// eslint-disable-next-line no-case-declarations
									const data = require('../data.json');

									data.shop.spotifyRequest[i.user.id] = {
										'uri': response.data.tracks.items[explicitFilteredIndexes[pageNum - 1][number - 1]].uri,
										'art': response.data.tracks.items[explicitFilteredIndexes[pageNum - 1][number - 1]].album.images[0].url,
										'displayName': `${response.data.tracks.items[explicitFilteredIndexes[pageNum - 1][number - 1]].name} - ${response.data.tracks.items[explicitFilteredIndexes[pageNum - 1][number - 1]].artists[0].name}`,
									};
									await wait(100);

									fs.writeFileSync(path.join(__dirname, '../data.json'), JSON.stringify(data, null, 2));

									embed = new EmbedBuilder()
										.setAuthor({ name: `${i.user.displayName} would like to play`, iconURL: 'http://1000logos.net/wp-content/uploads/2017/08/Spotify-Logo.png' })
										.setThumbnail(response.data.tracks.items[explicitFilteredIndexes[pageNum - 1][number - 1]].album.images[0].url)
										.setTitle(`${response.data.tracks.items[explicitFilteredIndexes[pageNum - 1][number - 1]].name} - ${response.data.tracks.items[explicitFilteredIndexes[pageNum - 1][number - 1]].artists[0].name}`)
										.setURL(response.data.tracks.items[explicitFilteredIndexes[pageNum - 1][number - 1]].external_urls.spotify)
										.setColor('Green');

									row = new ActionRowBuilder()
										.addComponents(
											new ButtonBuilder()
												.setStyle(ButtonStyle.Success)
												.setLabel('Accept')
												.setCustomId(`spotifyRequest|a|${i.user.id}`),
										)
										.addComponents(
											new ButtonBuilder()
												.setStyle(ButtonStyle.Danger)
												.setLabel('Deny')
												.setCustomId(`spotifyRequest|d|${i.user.id}`),
										);

									await i.client.channels.fetch(moderatorChannel).then(async channel => {
										await channel.send({ embeds: [embed], components: [row] });
									});


									embed = new EmbedBuilder()
										.setColor('Green')
										.setAuthor({ name: 'Your request has been sent to Moderators.', iconURL: 'http://1000logos.net/wp-content/uploads/2017/08/Spotify-Logo.png' })
										.setDescription('If your request doesn\'t get accepted by the end of the stream, open a ticket and you will be refunded.');

									await m3.edit({ embeds: [embed], components: [] });
								}
							});
						});
					} else {
						returnPage(pageNum, q, m2);
					}
				});
			};
			returnPage(1, message.content, msg);
		});
		// tracksList[0] += `${index + 1}. ${song.name} by ${song.artists[0].name}\n`;


	});
};

module.exports = {
	fields: {
		selectMenu: {
			label: 'Spotify Song Request',
			description: 'Find a song on spotify to play on stream!',
			value: 'spotifyRequest',
		},
		expandedView: {
			title: 'Spotify Song Request',
			description: 'Request for a song on Spotify to be played on stream!\n\n• *If the song is marked as explicit, it will automatically be denied*\n• *All requests must go through moderators before they are sent to stream!*',
		},
	},
	cost: 5000,
	requestQueue: true,
	enabled: isLive,
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

		await songQuery(interaction, sendMessage);
	},
};