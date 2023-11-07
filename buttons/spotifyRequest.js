/* eslint-disable no-mixed-spaces-and-tabs */
// Import required modules and libraries
const express = require('express');
const { EmbedBuilder } = require('discord.js');
const app = express();
const SpotifyWebApi = require('spotify-web-api-node');
const wait = require('node:timers/promises').setTimeout;
const axios = require('axios');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const configData = fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8');
const config = JSON.parse(configData);
const querystring = require('querystring');
const { spotifyClientId, spotifyClientSecret, logChannel } = config;
const { removeBal } = require('../data/arcade functions');

// Configuration
const port = 4159;
const redirectUri = `http://localhost:${port}/callback`;
const spotifyApi = new SpotifyWebApi({
	spotifyClientId,
	spotifyClientSecret,
	redirectUri,
});


// Function to obtain Spotify access token
const getToken = async (i) => {
	const server = app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
		const start = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
		require('child_process').exec(`${start} ${`http://localhost:${port}/login`}`);
	});

	app.get('/login', function(req, res) {
		res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
            	response_type: 'code',
            	client_id: spotifyClientId,
            	scope: 'user-modify-playback-state',
            	redirect_uri: redirectUri,
            	state: crypto.randomBytes(8).toString('hex'),
            }));
	});

	app.get('/callback', function(req, res) {
		const code = req.query.code || null;
		const state = req.query.state || null;

		res.send('Authorization Successful');
		server.close(() => console.log('Server closed'));

		if (state === null) {
			res.redirect('/#' +
                querystring.stringify({
                	error: 'state_mismatch',
                }));
		} else {
			const authOptions = {
				url: 'https://accounts.spotify.com/api/token',
				method: 'post',
				params: {
					code: code,
					redirect_uri: redirectUri,
					grant_type: 'authorization_code',
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization': 'Basic ' + (Buffer.from(spotifyClientId + ':' + spotifyClientSecret).toString('base64')),
				},
			};

			axios(authOptions)
				.then(async response => {
					const tempFile = require('../temp.json');
					tempFile.spotifyToken = response.data.access_token;
					await wait(100);
					fs.writeFileSync(path.join(__dirname, '../temp.json'), JSON.stringify(tempFile, null, 2));

					spotifyrequest(i);
				})
				.catch(error => {
					console.error(error);
				});
		}
	});
};

// Function to add songs to Spotify queue
const spotifyrequest = async (interaction) => {
	const customIdSplit = interaction.customId.split('|');
	switch (customIdSplit[1]) {
	case 'a':

		// eslint-disable-next-line no-case-declarations
		const { spotifyToken } = require('../temp.json');

		try {
			spotifyApi.setAccessToken(spotifyToken);
			const data = require('../data/data.json');

			try {
				await spotifyApi.addToQueue(data.shop.spotifyRequest[customIdSplit[2]].uri);
				await interaction.message.delete();

				let embed = null;
				await interaction.client.users.fetch(customIdSplit[2]).then((user) => {
					embed = new EmbedBuilder()
						.setColor('DarkGreen')
						.setAuthor({ name: `${interaction.user.displayName} accepted ${user.displayName}'s request to play`, iconURL: interaction.user.displayAvatarURL() })
						.setTitle(data.shop.spotifyRequest[customIdSplit[2]].displayName)
						.setURL(`https://open.spotify.com/track/${data.shop.spotifyRequest[customIdSplit[2]].uri.split(':')[2]}`)
						.setThumbnail(data.shop.spotifyRequest[customIdSplit[2]].art);
				});

				await interaction.client.channels.fetch(logChannel).then(async (channel) => {
					await channel.send({ embeds: [embed] });
				});

				delete data.shop.spotifyRequest[customIdSplit[2]];
				await wait(100);
				fs.writeFileSync(path.join(__dirname, '../data/data.json'), JSON.stringify(data, null, 2));
				await removeBal(customIdSplit[2], 5000);
			} catch (error) {
				console.error('Error adding song to queue:', error);
				getToken(interaction);
			}
		} catch (error) {
			console.error(error);
			getToken(interaction);

		}
		break;
	case 'd':
		// eslint-disable-next-line no-case-declarations
		let embed = null;
		// eslint-disable-next-line no-case-declarations
		const data = require('../data/data.json');
		await interaction.message.delete();

		await interaction.client.users.fetch(customIdSplit[2]).then((user) => {
			embed = new EmbedBuilder()
				.setColor('DarkGreen')
				.setAuthor({ name: `${interaction.user.displayName} accepted ${user.displayName}'s request to play`, iconURL: interaction.user.displayAvatarURL() })
				.setTitle(data.shop.spotifyRequest[customIdSplit[2]].displayName)
				.setURL(`https://open.spotify.com/track/${data.shop.spotifyRequest[customIdSplit[2]].uri.split(':')[2]}`)
				.setThumbnail(data.shop.spotifyRequest[customIdSplit[2]].art);
		});

		await interaction.client.channels.fetch(logChannel).then(async (channel) => {
			await channel.send({ embeds: [embed] });
		});

		delete data.shop.spotifyRequest[customIdSplit[2]];
		await wait(100);
		fs.writeFileSync(path.join(__dirname, '../data/data.json'), JSON.stringify(data, null, 2));
		break;
	}
};

// Export the spotifyrequest function
module.exports = spotifyrequest;
