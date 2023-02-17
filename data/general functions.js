/* eslint-disable no-unused-vars */
const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
const { addBal } = require('../data/arcade utils.js');
const { guildId } = require('../config.json');
const wait = require('node:timers/promises').setTimeout;
const readline = require('readline');
const fetch = require('node-fetch');


const cmdFunctions = (client) => {
	rl.question('> ', async function(input) {
		if (input.includes('send')) {
			if (!input.includes('|')) {
				console.log('Incorrect format! Usage: (id)|(message)');
				cmdFunctions();
			} else {
				const inputSplitdummy = input.split('-');
				const inputSplit = String(inputSplitdummy[1]).split('|');
				const channel = client.channels.cache.get(inputSplit[0]);
				channel.send(inputSplit[1]);
				cmdFunctions();
			}
		} else if (input.includes('dm')) {
			try {
				const inputSplitdummy = input.split('-');
				const inputSplit = String(inputSplitdummy[1]).split('|');
				console.log(inputSplit[0]);
				client.users.send(inputSplit[0], inputSplit[1]);
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
			let data = await JSON.stringify(rawData.data);
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
		}
	});
};

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});


const unscrambleGame = async (client) => {
	const { arcadeId } = require('../config.json');
	const file = fs.readFileSync('C:\\Users\\procr_sriu2y2\\Desktop\\Discord bots\\ProCraftBot\\data\\unscramble words.txt').toString().split(/\r\n|\n/);
	const filePos = Math.floor(Math.random() * file.length);

	const wordScrambled = scrambleWord(file[filePos]);
	const amount = wordScrambled.length * 25;
	const initalEmbed = new EmbedBuilder()
		.setTitle(`The first person to unscramble \n"${wordScrambled}" gets ${amount} ProCraft Points!`)
		.setColor('Blue');

	const a = client.channels.cache.get(arcadeId);
	a.send({ embeds: [initalEmbed] }).then(interaction => {
		const filter = m => m.content.toLowerCase().replace(' ', '') === (file[filePos].toLowerCase().replace(' ', ''));
		const collector = interaction.channel.createMessageCollector({ filter, time: 900000 });

		collector.on('collect', async m => {
			const status = addBal(m.author.id, amount);
			if (!status) {
				const newEmbed = new EmbedBuilder()
					.setTitle(`${m.author.username} unscrambled "${file[filePos]}" first, but hasnt opened an account yet. Therefore, they were not given the points. Open one with /open-acc!`)
					.setColor('DarkRed');
				interaction.channel.send({ embeds: [newEmbed] });
			} else {
				const newEmbed = new EmbedBuilder()
					.setTitle(`${m.author.username} unscrambled "${file[filePos]}" first!`)
					.setColor('DarkGreen');
				interaction.channel.send({ embeds: [newEmbed] });
			}
			collector.stop();
			await wait(15000);
			const currentDate = new Date();
			const hour = currentDate.getHours();
			if (hour == 2) {
				console.log(`Clearing #${interaction.channel.name}`);
				await interaction.channel.bulkDelete(100);
				let messageCount = await interaction.channel.messages.fetch();
				while (messageCount.size != 0) {
					await wait(15000);
					try {
						interaction.channel.bulkDelete(100);
					} catch (error) {console.error(error);}
					messageCount = await interaction.channel.messages.fetch();
				}
			}
			await wait (300000);

			unscrambleGame(client);
		});

		collector.on('end', async (collected) => {
			if (collected.size == 0) {
				const endEmbed = new EmbedBuilder()
					.setTitle(`Nobody got the word. The word was "${file[filePos]}".`)
					.setColor('DarkRed');
				interaction.channel.send({ embeds: [endEmbed] });
				const currentDate = new Date();
				const hour = currentDate.getHours();
				if (hour == 0) {
					console.log(`Clearing #${interaction.channel.name}`);
					await interaction.channel.bulkDelete(100);
					let messageCount = await interaction.channel.messages.fetch();
					while (!messageCount.size == 2) {
						await wait(15000);
						interaction.channel.bulkDelete(100);
						messageCount = await interaction.channel.messages.fetch();
					}
				}
				await wait(3600000);
				unscrambleGame(client);
			}
		});
	});
};

const scrambleWord = (word) => {
	const wordTemp = word.split('');
	for (let i = wordTemp.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const tmp = wordTemp[i];
		wordTemp[i] = wordTemp[j];
		wordTemp[j] = tmp;
	}
	const wordNew = wordTemp.join('');
	return wordNew;
};

const checkRoles = async (client) => {
	let embed = new EmbedBuilder()
		.setTitle('Role checks in progress...')
		.setColor('DarkRed');
	const Guild = await client.guilds.fetch(guildId);
	const members = await Guild.members.fetch();
	const memberIds = members.map(user => user.id);
	const roleStructure = require('../data/role structure');
	const { logChannel } = require('../config.json');
	await client.channels.cache.get(logChannel).send({ embeds: [embed] }).then(async message => {


		let returnDescription = '**✅ All members were successfully checked**\n\n';

		// for each user
		for (let i = 0; i < memberIds.length; i++) {
			const member = await Guild.members.fetch(memberIds[i]);
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
							await wait (5000);
							returnDescription = returnDescription + `➕ Added **${category}** dividing role for **${member.user.username}**\n\n`;
							member.roles.add(roleStructure[category].role);
							await wait (5000);
						}
					}
				}
				if (member.roles.cache.some(R => R.id == roleStructure[category].role) && !userHasCategoryRole) {
					const roleName = await Guild.roles.cache.get(roleStructure[category].role).name;
					member.roles.remove(roleStructure[category].role);
					await wait (5000);
					returnDescription = returnDescription + `❌ Removed the dividing role for **${category}** from **${member.user.username}**, because they did not have a role in the category.\n\n`;
				}

			}


			await wait(5000);
		}
		embed = new EmbedBuilder()
			.setTitle('Role check completed')
			.setDescription(returnDescription)
			.setColor('DarkGreen');
		await message.edit({ embeds: [embed] });
	});

};

module.exports = {
	checkRoles: checkRoles,
	cmdFunctions: cmdFunctions,
	scrambleWord: scrambleWord,
	unscrambleGame: unscrambleGame,
};