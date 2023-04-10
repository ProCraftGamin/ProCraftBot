const { EmbedBuilder } = require('discord.js');

const giveEventRole = async (interaction) => {
	const buttonIdSplit = interaction.customId.split('|');
	if (interaction.member.roles.cache.some(role => role.id == buttonIdSplit[1])) {
		interaction.member.roles.remove(buttonIdSplit[1]);
		const embed = new EmbedBuilder()
			.setColor('DarkGreen')
			.setTitle('No worries!')
			.setDescription('You will not be notified when the event starts!');
		interaction.reply({ embeds: [embed], ephemeral: true });
	} else {

		interaction.member.roles.add(buttonIdSplit[1]);
		if (!interaction.member.roles.cache.has(buttonIdSplit[2])) {
			interaction.member.roles.add(buttonIdSplit[2]);
		}
		const embed = new EmbedBuilder()
			.setColor('DarkGreen')
			.setTitle('Thank you for taking interest in the event!')
			.setDescription('You will be notified when it starts!');
		interaction.reply({ embeds: [embed], ephemeral: true });
	}
};

module.exports = giveEventRole;