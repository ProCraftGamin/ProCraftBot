const { EmbedBuilder, roleMention, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { pollChannel } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('(DEV ONLY)')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addBooleanOption(option =>
			option.setName('ping')
				.setDescription('Ping people with the poll pings role?')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('prompt')
				.setDescription('The prompt for the poll')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('additional-info')
				.setDescription('addtional info about the prompt')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('option-1')
				.setDescription('the emoji to go in option 1')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('option-2')
				.setDescription('the emoji to go in option 2'))
		.addAttachmentOption(option =>
			option.setName('attachment')
				.setDescription('Any attachment you would like to add')),

	async execute(interaction) {
		try {
			let embed = new EmbedBuilder();
			if (interaction.options.getAttachment('attachment') == null) {
				embed = new EmbedBuilder()
					.setColor('DarkGreen')
					.setTitle(interaction.options.getString('prompt'))
					.setDescription(interaction.options.getString('additional-info'));
			} else {
				embed = new EmbedBuilder()
					.setColor('DarkGreen')
					.setTitle(interaction.options.getString('prompt'))
					.setDescription(interaction.options.getString('additional-info'))
					.setImage(interaction.options.getAttachment('attachment').url);
			}

			await interaction.reply({ content: 'Sucessfully created a poll.', ephemeral: true });
			if (interaction.options.getBoolean('ping')) {
				await interaction.guild.channels.cache.get(pollChannel).send({ content: roleMention('975259875493945344'), embeds: [embed] }).then(async sentMessage => {
					sentMessage.react(interaction.options.getString('option-1'));
					if (interaction.options.getString('option-2')) {
						sentMessage.react(interaction.options.getString('option-2'));
					}
					await wait (1000);
					sentMessage.edit({ content: '', embeds: [embed] });
				});
			} else {
				await interaction.guild.channels.cache.get(pollChannel).send({ embeds: [embed] }).then(sentMessage => {
					sentMessage.react(interaction.options.getString('option-1'));
					if (interaction.options.getString('option-2')) {
						sentMessage.react(interaction.options.getString('option-2'));
					}
				});
			}
		} catch (error) {
			interaction.client.users.send('775420795861205013', `An error has occured. ${error}`);
			console.error(error);
		}
	},
};