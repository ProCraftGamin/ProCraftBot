const { EmbedBuilder, SlashCommandBuilder, channelMention } = require('discord.js');
const { suggestionsChannel } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suggest')
		.setDescription('Suggest something for discord, twitch, or youtube!')
		.addStringOption(option =>
			option.setName('title')
				.setDescription('The title of your suggestion!')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('description')
				.setDescription('Description of your suggestion!')
				.setRequired(true)),
	async execute(interaction) {
		try {
			const embed = new EmbedBuilder()
				.setColor('Blue')
				.setTitle(interaction.options.getString('title'))
				.setAuthor({ iconURL: interaction.user.avatarURL({ extension: 'png' }), name: `${interaction.user.username} suggests:` })
				.setDescription(interaction.options.getString('description'));

			console.log(`${interaction.user.username} used /suggest`);
			await interaction.reply({ content: `Thank you for your suggestion! You can vote on it in ${channelMention(suggestionsChannel)}!`, ephemeral: true });
			await interaction.guild.channels.cache.get(suggestionsChannel).send({ embeds: [embed] }).then(sentMessage => {
				sentMessage.react('⬆️');
				sentMessage.react('⬇️');
			});
		} catch (error) {
			interaction.client.users.send('775420795861205013', error);
			console.error(error);
		}
	},
};