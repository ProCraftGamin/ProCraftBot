const fs = require('fs');
const path = require('path');

function sortObjectDescending(obj) {
    // Convert the input object into an array of key-value pairs
    const entries = Object.entries(obj);
  
    // Sort the array in descending order based on the values
    entries.sort((a, b) => b[1] - a[1]);
  
    // Create a new object from the sorted array
    const result = {};
    for (const [key, value] of entries) {
      result[key] = value;
    }
  
    return result;
  }
  

  const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Shows you the ProCraft Points leaderboard!'),
	async execute(interaction) {
		const pointsObj = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/data.json'))).balances;

    const leaderboard = await sortObjectDescending(pointsObj);

    let i = 0;
    let leaderboardDisplay = ''
    for (const user in leaderboard) {
      if (i > 10) break;
      const userObj = await interaction.client.users.fetch(user);
      leaderboardDisplay += `**${i + 1}:** ${userObj.displayName} - ${leaderboard[user]}<:procraftpoint:1149179916466790441>\n`;
      i++;
    }

    await interaction.reply({ embeds: [new EmbedBuilder().setColor('Blue').setAuthor({ name: 'Leaderboard'}).setDescription(leaderboardDisplay)] });
	},
};