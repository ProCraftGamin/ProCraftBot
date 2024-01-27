/* eslint-disable no-unused-vars */
const fs = require('fs');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { updateStocks } = require('./arcade functions');
const { addBal } = require('./arcade functions.js');
const { guildId } = require('../config.json');
const wait = require('node:timers/promises').setTimeout;
const readline = require('readline');
const fetch = require('node-fetch');
const path = require('path');


const cmdFunctions = (client) => {
	rl.question('> ', async function(input) {
		if (input.includes('send')) {
			if (!input.includes('|')) {
				console.log('Incorrect format! Usage: (id)|(message)');
				cmdFunctions();
			} else {
				const inputSplitdummy = input.split('-');
				const inputSplit = String(inputSplitdummy[1]).split('|');
				try {
					const channel = client.channels.fetch(inputSplit[0]);
					channel.send(inputSplit[1]);
				} catch (error) {console.error(error);}
				cmdFunctions();
			}
		} else if (input.includes('dm')) {
			try {
				const inputSplitdummy = input.split('-');
				const inputSplit = String(inputSplitdummy[1]).split('|');
				console.log(inputSplit[0]);
				try {
					client.users.send(inputSplit[0], inputSplit[1]);
				} catch (error) {console.error(error);}
				cmdFunctions();
			} catch (error) {
				console.error(error);
				cmdFunctions();
			}
		} else if (input.includes('setclip')) {
			const { token } = require('../temp.json');
			const inputSplitdummy = input.split('|');
			const res = await fetch('https://api.twitch.tv/helix/clips?id=' + inputSplitdummy[1], {
				method: 'GET',
				headers: {
					'Client-ID': 'nysfco3h85ws5v2jsddyog392ktpen',
					'Authorization': 'Bearer ' + token,
				},
			});
			const rawData = await res.json();
			let data = await JSON.stringify(rawData.data, null, 2);
			data = JSON.parse(data);
			if (data.length == 0) {
				console.log(`Unable to find a clip with ID "${inputSplitdummy[1]}"`);
			} else {


				const temp = await JSON.parse(fs.readFileSync('temp.json'), null, 2);
				temp.top_clip = inputSplitdummy[1];

				await fs.writeFileSync('temp.json', JSON.stringify(temp, null, 2));
				console.log(`Successfully set the top clip to "${data[0].title}"`);
			}
			cmdFunctions();
		} else if (input.includes('config')) {
			const inputSplit = input.split('|');

			switch (inputSplit[1]) {
			case 'stockChannel':
				if (inputSplit[2] == null) {
					console.log('Incorrect format! Usage: config|stockChannel|(Channel ID)');
				} else {
					client.channels.fetch(inputSplit[2]).then(channel => {
						channel.send('Loading stock market...').then(message => {
							const data = require('./data.json');
							data.stocks.channelId = inputSplit[2];
							data.stocks.messageId = message.id;
							fs.writeFileSync(path.join(__dirname, '/data.json'), JSON.stringify(data, null, 2));
							updateStocks('PCB', 0, '+', client);
							console.log('Successfully set stock market channel.\n');
							cmdFunctions();
						});
					});
				}
			}
		}
	});
};

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const checkRoles = async (client) => {
	const Guild = await client.guilds.fetch(guildId);
	const members = await Guild.members.fetch();
	const memberIds = members.map(user => user.id);
	const roleStructure = require('../data/role structure');
	const { logChannel } = require('../config.json');
	const logsChannel = client.channels.fetch(logChannel);


	let returnDescription = '**✅ All members were successfully checked**\n\n';
	let roleChanged = false;

	// for each user
	for (let i = 0; i < memberIds.length; i++) {
		let finalNick = '';
		let index = 0;

		const member = await Guild.members.fetch(memberIds[i]);
		for (const char of member.displayName) {
			if (index == 0 && char.toLowerCase() == char) finalNick += char.toUpperCase();
			else if ((member.displayName[index - 1] == ' ' || member.displayName[index - 1] == '_') && char.toLowerCase() == char) finalNick += char.toUpperCase();
			else finalNick += char;
			index++;
		}

		if (!member.permissions.has('Administrator')) if (finalNick != member.displayName) member.setNickname(finalNick);
		const userRoles = member.roles.cache.map(role => role.id);
		// for each role the user has

		// for each category
		for (const category in roleStructure) {
			let userHasCategoryRole = false;
			// for each role in the category
			for (const role in roleStructure[category]) {
				// if user has a role in the category that isnt the dividing role check for dividing role and if they dont have it add it
				if (userRoles.some(r => r == roleStructure[category][role]) && role !== 'role') {
					userHasCategoryRole = true;
					if (!member.roles.cache.some(R => R.id == roleStructure[category].role)) {
						returnDescription = returnDescription + `➕ Added **${category}** dividing role for **${member.user.username}**\n\n`;
						member.roles.add(roleStructure[category].role);
						roleChanged = true;
					}
				}
			}
			if (member.roles.cache.some(R => R.id == roleStructure[category].role) && !userHasCategoryRole) {
				const roleName = await Guild.roles.fetch(roleStructure[category].role).name;
				member.roles.remove(roleStructure[category].role);
				returnDescription = returnDescription + `❌ Removed the dividing role for **${category}** from **${member.user.username}**, because they did not have a role in the category.\n\n`;
				roleChanged = true;
			}

		}
	}
	if (roleChanged == true) {
		const embed = new EmbedBuilder()
			.setTitle('Role check completed')
			.setDescription(returnDescription)
			.setColor('DarkGreen');
		await client.channels.fetch(logChannel).then(channel => channel.send({ embeds: [embed] }));
	}

};


module.exports = {
	checkRoles: checkRoles,
	cmdFunctions: cmdFunctions,
};