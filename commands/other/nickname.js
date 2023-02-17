const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { moderatorChannel } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nickname')
		.setDescription('Request to change your server nickname!')
		.addStringOption(option =>
			option.setName('nickname')
				.setDescription('The nickname you would like to request! Type "Reset" to reset your nickname!')),
	async execute(interaction) {
		if (interaction.options.getString('nickname').replace(' ', '').toLowerCase() == 'reset') {
			const gMember = await interaction.guild.members.fetch(interaction.user.id);
			gMember.setNickname('');
			const userEmbed = new EmbedBuilder()
				.setTitle('Your nickname has been reset!')
				.setColor('DarkGreen');
			await interaction.reply({ embeds: [userEmbed], ephemeral: true });
		} else {
			const userEmbed = new EmbedBuilder()
				.setTitle(`Your request to change your name to "${interaction.options.getString('nickname')}" has been sent to moderators!`)
				.setDescription('You will recieve a DM once moderators review your request!')
				.setColor('DarkGreen');

			const moderatorEmbed = new EmbedBuilder()
				.setAuthor({ name: `${interaction.user.username} has requested to change their nickname to *${interaction.options.getString('nickname')}*`, iconURL: interaction.user.avatarURL() })
				.setColor('DarkGreen');

			const moderatorButtons = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`m|n|a|${interaction.user.id}|${interaction.options.getString('nickname')}`)
						.setStyle(ButtonStyle.Success)
						.setLabel('Approve'),
				)
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`m|n|d|${interaction.user.id}|${interaction.options.getString('nickname')}`)
						.setStyle(ButtonStyle.Danger)
						.setLabel('Deny'),
				);


			await interaction.reply({ embeds: [userEmbed], ephemeral: true });
			await interaction.client.channels.cache.get(moderatorChannel).send({ embeds: [moderatorEmbed], components: [moderatorButtons] });
		}
	},
};