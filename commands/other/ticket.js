const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const ticket = require('../../data/ticket functions.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('Do an action related to tickets')
		.addSubcommand(subcommand =>
			subcommand
				.setName('create')
				.setDescription('Create a new ticket')
				.addStringOption(option => option
					.setName('title')
					.setDescription('Title of the ticket')
					.setMaxLength(100)
					.setMinLength(2)
					.setRequired(true))
				.addStringOption(option => option
					.setName('description')
					.setDescription('Description of the ticket')
					.setMinLength(10)
					.setMaxLength(500)
					.setRequired(true))),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		switch (interaction.options.getSubcommand()) {
		case 'create':
			// eslint-disable-next-line no-case-declarations
			const result = await ticket.openTicket({ userId: interaction.user.id, ticket: { title: interaction.options.getString('title'), description: interaction.options.getString('description') } }, interaction.client, 'user');
			if (result == 'error') {
				const embed = new EmbedBuilder()
					.setColor('Red')
					.setTitle('Something went wrong. Please try again.')
					.setDescription('**If this keeps happening, please DM ProCraftGamin or open a bug report using /bug-report**');

				interaction.editReply({ embeds: [embed], ephemeral: true });
			} else {
				interaction.editReply(`*🎫 Ticket created • <#${result}> *`);
			}
			break;
		}
	},
};