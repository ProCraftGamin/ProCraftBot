const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const watermark = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setDisabled(true)
			.setLabel('Sent from server: ProCraftDiscord')
			.setStyle(ButtonStyle.Secondary)
			.setCustomId('subscribe to procraftgamin'),
	);
const giveRole = (interaction) => {
	const buttonIdSplit = interaction.customId.split('|');
	const roleName = interaction.guild.roles.cache.get(buttonIdSplit[1]).name;
	if (interaction.member.roles.cache.some(role => role.id === buttonIdSplit[1])) {
		interaction.member.roles.remove(buttonIdSplit[1]);
		interaction.client.users.send(interaction.user, { content: `✅ Successfully removed **${roleName}**`, components: [watermark] });
		interaction.deferUpdate();
		console.log(`${interaction.user.username} removed ${roleName}`);
	} else {
		interaction.member.roles.add(buttonIdSplit[1]);
		if (!interaction.member.roles.cache.has(buttonIdSplit[2])) {
			interaction.member.roles.add(buttonIdSplit[2]);
		}
		interaction.client.users.send(interaction.user, { content: `✅ Successfully added **${roleName}**`, components: [watermark] });
		interaction.deferUpdate();
		console.log(`${interaction.user.username} added ${roleName}`);
	}
};

module.exports = giveRole;