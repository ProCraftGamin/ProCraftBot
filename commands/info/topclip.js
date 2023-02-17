const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fetch = require('node-fetch');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('topclip')
		.setDescription('Shows you the top clip of the week!'),
	async execute(interaction) {
		interaction.deferReply();

		const info = JSON.parse(fs.readFileSync('temp.json'));
		// get clip data
		let res = await fetch('https://api.twitch.tv/helix/clips?id=' + info.top_clip, {
			method: 'GET',
			headers: {
				'Client-ID': 'nysfco3h85ws5v2jsddyog392ktpen',
				'Authorization': 'Bearer ' + info.token,
			},
		});
		let data = await res.json();
		const clipData = await JSON.parse(await JSON.stringify(data.data));

		// get data of user who clipped
		res = await fetch('https://api.twitch.tv/helix/users?id=' + clipData[0].creator_id, {
			method: 'GET',
			headers: {
				'Client-ID': 'nysfco3h85ws5v2jsddyog392ktpen',
				'Authorization': 'Bearer ' + info.token,
			},
		});
		data = await res.json();
		const userData = await JSON.parse(await JSON.stringify(data.data));

		res = await fetch('https://api.twitch.tv/helix/games?id=' + clipData[0].game_id, {
			method: 'GET',
			headers: {
				'Client-ID': 'nysfco3h85ws5v2jsddyog392ktpen',
				'Authorization': 'Bearer ' + info.token,
			},
		});
		data = await res.json();
		const gameData = await JSON.parse(await JSON.stringify(data.data));

		const embed = new EmbedBuilder()
			.setAuthor({ name: `Clipped by ${userData[0].display_name}`, iconURL: userData[0].profile_image_url })
			.setTitle(clipData[0].title)
			.setImage(clipData[0].thumbnail_url)
			.setThumbnail(gameData[0].box_art_url.replace('{width}', '188').replace('{height}', '250'))
			.setURL(clipData[0].url)
			.addFields(
				{ name: 'Views', value: clipData[0].view_count.toString(), inline: true },
				{ name: 'Game', value: gameData[0].name, inline: true },
			)
			.setColor('Blue');

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel('Watch on Twitch')
					.setURL(clipData[0].url),
			);

		await interaction.editReply({ embeds: [embed], components: [row] });

	},
};