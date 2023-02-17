const { ActionRowBuilder, ButtonBuilder, ButtonStyle, channelMention, EmbedBuilder, roleMention, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roles')
		.setDescription('(DEV ONLY)')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {

		const rolesEmbed = new EmbedBuilder()
			.setColor('Blue')
			.setTitle('Roles')
			.setDescription(`**┌─── Power ───┐**\n\n${roleMention('958248733802389504')}  → Personal role for ProCraftGamin. Any account with this role is one of ProCraftGamin's accounts.\n${roleMention('958249952092520498')}  → The admins of the server.\n${roleMention('961815613775429692')} → Moderators of the server. If they don't have ${roleMention('958250050524426261')} please don't bother them about server issues. They'll figure it out on their own.\n\n**┌─── Special ───┐**\n${roleMention('1028784981037813821')} → The VIP's of the community, or just anyone with VIP in my twitch chat.\n${roleMention('959586343078490193')}  → People ProCraftGamin knows IRL. Don't ask them for my address, they won't tell you lol\n${roleMention('982860660364955668')}  → Anyone who has more than 50 followers or subscribers (depending on the platform) on a platform linked to their discord account.\n\n**┌─── Supporter ───┐**\n${roleMention('1034698302861611068')}  → People who have bought something on my ko-fi (Does not include free purchases)\n${roleMention('999148218891911319')}  → People who have boosted the server\n${roleMention('1032446747647152158')}  → People who have subscribed on my twitch channel\n\n**┌─── Bots ───┐**\n${roleMention('958505851042279477')} → That one bot i want to ban.\n${roleMention('958511307890511925')} → The server's custom bot. Type /help in ${channelMention('958511827690610718')} to get started!\n${roleMention('1028804512611303424')} → my man's got the tunes\n${roleMention('987140250780434433')} → Mostly background stuff. Don't worry about this one\n\n**┌─── Pings ───┐**\n${roleMention('989400028630122496')}  → People who want to be pinged when a new event is scheduled, or when an event starts!\n${roleMention('975259875493945344')}  → People who want to be pinged whenever i post a poll\n${roleMention('1048428131435950150')} → People who want to be pinged whenever i go live!\n${roleMention('1048428954358390845')}  → People who want to be pinged whenever i tweet something!\n${roleMention('1048429228309364846')}   → People who want to be pinged whenever i post a new video on my dead youtube channel!\n\n**Use the buttons below to pick your roles!**\n‼️***If you decide you don't want a role anymore, just press the button again!***`);

		const rolesComp = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('r|975259875493945344|1048423010857660436')
					.setLabel('Poll pings')
					.setStyle(ButtonStyle.Primary),
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId('r|1048428131435950150|1048423010857660436')
					.setLabel('Livestream pings')
					.setStyle(ButtonStyle.Primary),
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId('r|1048428954358390845|1048423010857660436')
					.setLabel('Tweet pings')
					.setStyle(ButtonStyle.Primary),
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId('r|1048429228309364846|1048423010857660436')
					.setLabel('Video pings')
					.setStyle(ButtonStyle.Primary),
			);

		const pronounsEmbed = new EmbedBuilder()
			.setColor('Blue')
			.setTitle('Pronouns')
			.setDescription('**Use the buttons below to select your pronouns!**');

		const pronounsComp1 = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('r|1048440786410278982|1048439348955185242')
					.setLabel('She / Her')
					.setStyle(ButtonStyle.Success),
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId('r|1050156940422025287|1050333542678265856')
					.setLabel('He / Him')
					.setStyle(ButtonStyle.Success),
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId('r|1048440930958573658|1048439348955185242')
					.setLabel('She / They')
					.setStyle(ButtonStyle.Success),
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId('r|1048440972574457868|1048439348955185242')
					.setLabel('He / They')
					.setStyle(ButtonStyle.Success),
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId('r|1049006687509557378|1048439348955185242')
					.setLabel('They / Them')
					.setStyle(ButtonStyle.Success),
			);
		const pronounsComp2 = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('r|1048441045060431932|1048439348955185242')
					.setLabel('Any pronouns')
					.setStyle(ButtonStyle.Success),
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId('r|1048441088991576064|1048439348955185242')
					.setLabel('Ask My Pronouns (Ping In Server)')
					.setStyle(ButtonStyle.Success),
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId('r|1048441119861653506|1048439348955185242')
					.setLabel('Ask My Pronouns (DM Me)')
					.setStyle(ButtonStyle.Success),
			);


		await interaction.channel.send({ embeds: [rolesEmbed], components: [rolesComp] });
		await interaction.channel.send({ embeds: [pronounsEmbed], components: [pronounsComp1, pronounsComp2] });
		await interaction.reply({ content: 'Text successfully sent.', ephemeral: true });

	},
};