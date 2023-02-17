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
			.setDescription(`**To get started, type /open-acc in ${channelMention('1051985352006569984')} to get started!**\n\n**/tictactoe:** Challenge someone to a game of tic tac toe for ProCraft points!\n\n **Snake:** still a WIP, currently not active.\n\nEvery hour, a scrambled word will be send to ${channelMention('1051985352006569984')}. If you unscramble the word, you will get 100 ProCraft Points! (currently the only way besides tic tac toe of getting more ProCraft Points)`);

		await interaction.channel.send({ embeds: [embed] });
		await interaction.reply({ content: 'Info text successfully sent.', ephemeral: true });

	},
};