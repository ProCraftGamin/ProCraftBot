const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Gives you information on the commands of ProCraftBot!'),
	async execute(interaction) {
		const embed = new EmbedBuilder ()
			.setTitle('Welcome to ProCraftDiscord!')
			.setDescription('Here is all the commands for ProCraftBot. If you need help, ping ProCraftGamin!')
			.setURL('https://linktr.ee/procraftgamin')
			.addFields(
				{ name: '**General commands**', value: '*Used in <#958511827690610718>*\n\n**/socials** → Gives you all of ProCraftGamin\'s socials!\n**/suggest**  → Lets you suggest something for the bot, the server, my twitch or my youtube.\n\n**/ping** → Pings the bot! If this fails, the bot is either offline, or something threw an error. Ping ProCraftGamin for help!\n**/nickname** → Lets you request to change your nickname, or reset it.\n**/topclip** → Shows you the top clip currently of my twitch channel! (changed whenever I want feel like it lol)\n\nㅤ' },
				{ name: '**Arcade commands**', value: '*Used in <#1161783151111176282>*\n\n**/bal** → Used to see how many ProCraft Points you have.\n**/tictactoe** → Challenge someone to a game of tic tac toe!\n**/snake** → Play a game of snake!\n**/connect4** → Challenge someone to a game of Connect 4!' },
			)
			.setThumbnail('https://i.imgur.com/gXRJVBK.png')
			.setColor('Blue');
		console.log(`${interaction.user.username} used /help`);
		interaction.reply({ embeds: [embed] });
	},
};