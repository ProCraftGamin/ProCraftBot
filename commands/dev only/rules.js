const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rules')
		.setDescription('(DEV ONLY)')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {

		const embed = new EmbedBuilder()
			.setColor('Blue')
			.setTitle('Welcome to ProCraftDiscord!')
			.setDescription('**To get access to the channels, please read through the rules and make sure you agree with them.**\n- BE NICE TO EVERYONE (that also means no toxicity)\n- THIS IS A SFW (safe for work) SERVER\n- Respect the mods\n- EVERYONE\'S OPINION IS THEIR OPINION. if you do not agree with it, don\'t make a big deal about it\n- Please do not try to convince people to share your beliefs, however, talking about them is fine within the rules.\n- If you were banned don\'t request to be unbanned on another account. That is considered ban evading and will get your alt banned.\n- Any fighting between you and another chatter (including people who aren\'t mods) will get you both muted.\n-No doxxing or giving away personal info. It will result in a permanent ban.\n-Please keep it english\n-NO SPAMMING\n-If moderators/admins are spamming or breaking rules ping ProCraftGamin.\nFAILURE TO CHAT BY THE RULES WILL RESULT IN A WARNING, 3 WARNINGS = 1 BAN\n- Have fun!!\nAlso please keep channels on topic, if someone goes off-topic in a channel they will be timed out for 5 minutes, but they will not receive a warning\nRules that aren\'t required but you should still follow:\nSub to ProCraftGamin: https://www.youtube.com/channel/UCh4YeYnQcdmTMB-Q4ckuiDQ?sub_confirmation=1\nFollow ProCraftGamin on twitch: https://twitch.tv/procraftgamin\n\n**Press the button below if you agree to the rules to get access to the channels!**\n*If you do not agree with these rules, please leave the server.*');

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('getMemberRole')
					.setLabel('"I agree to the rules"')
					.setStyle(ButtonStyle.Success),
			);
		await interaction.channel.send({ embeds: [embed], components: [row] });
		await interaction.reply({ content: 'Rules text successfully sent.', ephemeral: true });

	},
};