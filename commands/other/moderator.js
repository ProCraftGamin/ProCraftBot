/* eslint-disable no-case-declarations */
const { SlashCommandBuilder } = require('discord.js');
const { openTicket } = require('../../data/ticket functions');
const ticket = require('../../data/ticket functions');
let tempTicketData = '';
// const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mod')
		.setDescription('A command for moderator things')
		.addStringOption(option =>
			option.setName('action')
				.setDescription('The action you would like to preform')
				.setRequired(true)
				.addChoices(
					{ name: 'Create a ticket for someone else', value: 'ticketCreate' },
					{ name: 'Close this ticket', value: 'ticketClose' },
					{ name: 'Reopen this ticket', value: 'ticketReopen' },
				),
		)
		.addUserOption(option =>
			option.setName('user')
				.setDescription('(Optional) The user to preform the action on'),
		),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		switch (interaction.options.getString('action')) {
		case 'ticketCreate':
			if (!interaction.options.getUser('user')) {
				await interaction.editReply('❌ **Please specify a user!**');
			} else {
				const id = await openTicket({ userId: interaction.options.getUser('user').id, ticket: { title: 'moderator ticket' } }, interaction.client, 'mod');
				await interaction.editReply(`*🎫 Ticket created • <#${id}> *`);
			}
			break;
		case 'ticketClose':
			tempTicketData = require('../../data/data.json').tickets[interaction.channel.id];
			if (!tempTicketData) {
				await interaction.editReply({ content: '**Not a valid ticket!**\n*Please use this command in a ticket channel!*', ephemeral: true });
			} else {
				await ticket.closeTicket(interaction.client, interaction.channel.id, interaction.user);
				await interaction.deleteReply();
			}
			break;
		case 'ticketReopen':
			tempTicketData = require('../../data/data.json').tickets[interaction.channel.id];
			if (!tempTicketData) {
				await interaction.editReply({ content: '**Not a valid ticket!**\n*Please use this command in a ticket channel!*', ephemeral: true });
			} else {
				await ticket.reopenTicket(interaction.client, interaction.channel.id, interaction.user);
				await interaction.deleteReply();
			}
			break;
		}
	},
};