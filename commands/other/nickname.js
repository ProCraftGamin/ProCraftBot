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
			// define gMember, GuildMember object
			const gMember = await interaction.guild.members.fetch(interaction.user.id);

			// set GuildMember nickname to "", which just resets it
			gMember.setNickname('');

			// create return embed telling the user their nickname was reset
			const userEmbed = new EmbedBuilder()
				.setTitle('Your nickname has been reset!')
				.setColor('DarkGreen');

			// reply to user with the return embed
			await interaction.reply({ embeds: [userEmbed], ephemeral: true });

		} else if (interaction.options.getString('nickname').length > 75) {

			// create embed to tell user how long the message is
			const userEmbed = new EmbedBuilder()
				.setColor('DarkRed')
				.setTitle('Please keep your nickname under 75 characters!')
				.setDescription(`You entered **"${interaction.options.getString('nickname')}"**, which is ${interaction.options.getString('nickname').length} characters long.`);

			// reply to users request
			await interaction.reply({ embeds: [userEmbed], ephemeral: true });

		// any other condition
		} else {

			// create an embed telling the user their request was sent to moderators
			const userEmbed = new EmbedBuilder()
				.setTitle(`Your request to change your name to "${interaction.options.getString('nickname')}" has been sent to moderators!`)
				.setDescription('You will recieve a DM once moderators review your request!')
				.setColor('DarkGreen');

			// create the embeds telling moderators who wants to change their nickname to what
			const moderatorEmbed = new EmbedBuilder()
				.setAuthor({ name: `${interaction.user.username} has requested to change their nickname to *${interaction.options.getString('nickname')}*`, iconURL: interaction.user.avatarURL() })
				.setColor('DarkGreen');

			// create buttons for the embed to accept the nickname
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


			// reply to user telling them their request has been sent to moderators and send message
			// to #moderator-only for the moderators to approve
			await interaction.reply({ embeds: [userEmbed], ephemeral: true });
			await interaction.client.channels.cache.get(moderatorChannel).send({ embeds: [moderatorEmbed], components: [moderatorButtons] });
		}
	},
};
