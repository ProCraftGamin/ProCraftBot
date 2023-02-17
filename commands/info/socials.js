const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('socials')
		.setDescription('Gives you all of ProCraftGamin\'s socials!'),
	async execute(interaction) {
		const embed = new EmbedBuilder ()
			.setTitle('ProCraftGamin\'s socials')
			.setDescription('All of ProCraftGamin\'s socials. Feel free to follow or subscribe!')
			.setURL('https://linktr.ee/procraftgamin')
			.addFields(
				{ name: 'Youtube', value:'https://youtube.com/@ProCraftGamin' },
				{ name: 'Twitch', value: 'https://twitch.tv/ProCraftGamin' },
				{ name: 'Twitter', value: 'https://twitter.com/procraftgamin' },
			)
			.setThumbnail('https://i.imgur.com/gXRJVBK.png').setColor('BLUE');
		console.log(`${interaction.user.username} used /socials`);
		await interaction.reply({ embeds: [embed] });
	},
};