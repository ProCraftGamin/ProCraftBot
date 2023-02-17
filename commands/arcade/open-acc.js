const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const wait = require('node:timers/promises').setTimeout;
// const fs = require('fs');
const { getBal } = require('../../data/arcade utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('open-acc')
		.setDescription('Opens an account for the arcade!'),
	async execute(interaction) {
		const bal = getBal(interaction.user.id);
		if (bal) {
			const embed = new EmbedBuilder()
				.setAuthor({ name: `${interaction.user.username}, you already have an account open!`, iconURL: 'https://hotemoji.com/images/dl/u/double-exclamation-mark-emoji-by-twitter.png' })
				.setColor('DarkRed');

			interaction.reply({ embeds: [embed] });
			await wait (5000);
			interaction.deleteReply();
		} else {
			const balFile = fs.readFileSync('C:/Users/procr_sriu2y2/Desktop/Discord bots/ProCraftBot/data/balances.txt').toString().split('\n');
			balFile[balFile.length] = `${interaction.user.id}|300`;
			let balFileNew = '';
			for (let i = 0; i < balFile.length; i++) {
				if (i === balFile.length - 1) {
					balFileNew = `${balFileNew}${balFile[i]}`;
				} else {
					balFileNew = `${balFileNew}${balFile[i]}\n`;
				}
			}
			fs.writeFileSync('C:/Users/procr_sriu2y2/Desktop/Discord bots/ProCraftBot/data/balances.txt', balFileNew);

			const embed = new EmbedBuilder()
				.setAuthor({ name: `${interaction.user.username}, an account has been opened for you! You've been given 300 ProCraft Points to start out with by the bank!`, iconURL: interaction.user.avatarURL() })
				.setColor('DarkGreen');

			interaction.reply({ embeds: [embed] });
		}
	},
};