const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, channelMention } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('(DEV ONLY)')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {

		const embed = new EmbedBuilder()
			.setColor('Blue')
			.setTitle('Welcome to the arcade!')
			.setDescription(`**/tictactoe:** Challenge someone to a game of tic tac toe for ProCraft points!\n\n **/Snake:** Play a game of snake!\n\n**/connect4:** Challenge someone to a game of Connect 4!\n\nEvery 3 hours, a scrambled word will be sent to ${channelMention('1161783151111176282')}. If you unscramble the word, you will get ProCraft Points!\n\n**Streaks:** In <#1161783010371309660>, you have to send a word that starts with the last letter of the previous word, and you will earn ProCraft Points! Check the description of the channel for the previous word. **Each word must be from a different person than the last word**\n\n **Stock market:** In <#1161785056675758090>, you can buy and sell stocks. Stocks will change based on certain events, such as PCD will go up when someone joins and down if someone leaves, STRM will go up if i go live or if i get a follower, and all stocks will go down with inactivity.`);

		await interaction.channel.send({ embeds: [embed] });
		await interaction.reply({ content: 'Info text successfully sent.', ephemeral: true });

	},
};