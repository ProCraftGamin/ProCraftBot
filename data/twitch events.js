const { EmbedBuilder } = require('discord.js');
const tmi = require('tmi.js');
const fetch = require('node-fetch');
let isLive = false;
const options = {
	identity: {
		token: 'zr7aiyrele0lt5u1s2z1dm5kd8tf6h',
	},
	channels: ['procraftgamin'],
};
const twitchClient = new tmi.client(options);


const liveCheck = async (client) => {
	const webhook = await client.fetchWebhook('1069911118669168721', 'ASqofetPGgcMfCoq-L25GUBSlmgfgHjuHVoLg5y0nTXaSuYIOx_Mhs8KwrfRus0djYdv');
	const guild = await client.guilds.cache.get(webhook.guildId);
	const role = await guild.roles.cache.get('958250712125554699');
	const { token } = require('../temp.json');

	// fetch api to check if streamer is live
	const res = await fetch('https://api.twitch.tv/helix/streams?user_login=procraftgamin', {
		method: 'GET',
		headers: {
			'Client-ID': 'nysfco3h85ws5v2jsddyog392ktpen',
			'Authorization': 'Bearer ' + token,
		},
	});
	const rawData = await res.json();
	let data = await JSON.stringify(rawData.data);
	data = JSON.parse(data);

	// if streamer goes offline
	if (!data.length > 0 && isLive == true) {
		isLive = false;

		// lock channel
		webhook.channel.permissionOverwrites.create(role, { ViewChannel: false });
		// disconnect from twitch
		twitchClient.disconnect();

		// eslint-disable-next-line indent
    // if streamer goes online
	} else if (data.length > 0 && isLive == false) {
		isLive = true;
		let channel = client.channels.cache.get('958560668141907988');

		// fetch api to get user info (mostly just pfp)
		const result = await fetch('https://api.twitch.tv/helix/users?id=' + data[0].user_id, {
			method: 'GET',
			headers: {
				'Client-ID': 'nysfco3h85ws5v2jsddyog392ktpen',
				'Authorization': 'Bearer ' + token,
			},
		});
		let userData = await result.json();
		userData = await JSON.stringify(userData.data);
		userData = JSON.parse(userData);

		// create embed
		const embed = new EmbedBuilder()
			.setURL('https://twitch.tv/procraftgamin')
			.setColor('Red')
			.setAuthor({ name: `${userData[0].display_name} is now live!`, iconURL: userData[0].profile_image_url })
			.setTitle(data[0].title)
			.setImage((data[0].thumbnail_url).replace('{width}', '1920').replace('{height}', '1080'))
			.addFields(
				{ name: 'Playing', value: data[0].game_name, inline: true },
				{ name: 'Viewers', value: data[0].viewer_count.toString(), inline: true },
			);
		// send embed to live channel
		channel.send({ embeds: [embed], content: '<@1048428131435950150>' }).then(message => {
			message.edit({ embeds: [embed], content: '' });
		});

		// overwrite channel object to be webhook channel
		console.log(`Fetched webhook "${webhook.name}" in channel "${webhook.channel.name}"`);
		channel = webhook.channel;

		// unlock channel
		channel.permissionOverwrites.create(role, { ViewChannel: true });

		// define what happens when a twitch chat message is sent
		twitchClient.on('message', (twitchChannel, user, message) => {
			if (message.length != 1) {
			// fetch info for person who sent the chat message (mostly for pfp)
				fetch('https://api.twitch.tv/helix/users?login=' + user.username, {
					method: 'GET',
					headers: {
						'Client-ID': 'nysfco3h85ws5v2jsddyog392ktpen',
						'Authorization': 'Bearer zr7aiyrele0lt5u1s2z1dm5kd8tf6h',
					},
				}).then(result1 => {
				// if the status is ok from the fetch then continue
					if (result1.ok) {
						return result1.json();
					} else {
						throw new Error('Error in user request');
					}

				}).then(userData2 => {
					// if user used /me
					if (user['message-type'] == 'action') {
						// send italic message
						webhook.send({
							content: `*${message}*`,
							username: user['display-name'],
							avatarURL: userData2.data[0].profile_image_url,
						});
					} else {
						// send message
						webhook.send({
							content: message,
							username: user['display-name'],
							avatarURL: userData2.data[0].profile_image_url,
						});
					}
				});
			}
		});
		// connect to twitch
		twitchClient.connect();

		client.on('guildMemberAdd', (GuildMember) => {
			twitchClient.say('procraftgamin', `${GuildMember.user.username} joined the discord server!`);
		});
	}};

module.exports = {
	liveCheck: liveCheck,
};