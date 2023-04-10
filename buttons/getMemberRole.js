/* eslint-disable brace-style */
const { EmbedBuilder } = require('discord.js');
const current = new Date();
const time = current.toLocaleTimeString('en-US');

const giveMemberRole = (interaction) => {
	if (interaction.member.roles.cache.some(role => role.name === 'Member')) {
		const embed = new EmbedBuilder()
			.setColor('Red')
			.setTitle('You\'ve already agreed to the rules!')
			.setDescription('What do you think you\'re doing?');
		interaction.reply({ embeds: [embed], ephemeral: true });
	} else {
		const role = '958250712125554699';
		interaction.member.roles.add(role);
		const embed = new EmbedBuilder()
			.setColor('Blue')
			.setTitle('Thank you for agreeing to the rules!')
			.setDescription('Enjoy the server!');
		console.log(`${interaction.user.username} joined the server and accepted the rules at ${time}`);
		interaction.reply({ embeds: [embed], ephemeral: true });
	}
};

module.exports = giveMemberRole;
