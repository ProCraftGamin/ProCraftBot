let embed = '';
const fs = require('fs');
const path = require('path');
const { guildId } = require('../config.json');
const { ticketCategory, logChannel } = require('../config.json');
const { ChannelType } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const open = async (data, client, source, id) => {
	// if data is missing
	if (!data || !data.userId || !data.ticket.title) {
		return 'error';
	}
	const guild = await client.guilds.fetch(guildId);
	const user = await client.users.fetch(data.userId);
	const pending = require('./data.json');

	embed = new EmbedBuilder()
		.setColor('Blue')
		.setTimestamp();

	let ticket = '';
	switch (source) {
	case 'mod':
		embed.setAuthor({ name: `Welcome ${user.displayName}. A moderator has opened this ticket for you.`, iconURL: user.displayAvatarURL() })
			.setFooter({ text: data.ticket.title });
		ticket = await guild.channels.create({
			name: data.ticket.title,
			type: ChannelType.GuildText,
			parent: ticketCategory,
			permissionOverwrites: [
				{
					id: data.userId,
					allow: [PermissionFlagsBits.ViewChannel],
				},
				{
					id: '961815613775429692',
					allow: [PermissionFlagsBits.ViewChannel],
				},
				{
					id: guild.roles.everyone,
					deny: [PermissionFlagsBits.ViewChannel],
				},
			],
		});

		break;
	case 'user':
		embed.setAuthor({ name: `Welcome ${user.displayName}. Staff will be with you shortly.`, iconURL: user.displayAvatarURL() })
			.setDescription(`**Description:** ${data.ticket.description}`)
			.setFooter({ text: data.ticket.title });
		ticket = await guild.channels.create({
			name: data.ticket.title,
			type: ChannelType.GuildText,
			parent: ticketCategory,
			permissionOverwrites: [
				{
					id: data.userId,
					allow: [PermissionFlagsBits.ViewChannel],
				},
				{
					id: '961815613775429692',
					allow: [PermissionFlagsBits.ViewChannel],
				},
				{
					id: guild.roles.everyone,
					deny: [PermissionFlagsBits.ViewChannel],
				},
			],
		});
		break;
	case 'bug':
		embed.setAuthor({ name: `Welcome ${user.displayName}. This ticket has been opened because of a bug report you submitted.`, iconURL: user.displayAvatarURL() })
			.addFields(
				{ name: 'Bug report description', value: data.ticket.title },
				{ name: 'Bug report replication steps', value:data.ticket.description },
			);
		ticket = await guild.channels.create({
			name: `bug-report${id}`,
			type: ChannelType.GuildText,
			parent: ticketCategory,
			permissionOverwrites: [
				{
					id: data.userId,
					allow: [PermissionFlagsBits.ViewChannel],
				},
				{
					id: '961815613775429692',
					allow: [PermissionFlagsBits.ViewChannel],
				},
				{
					id: guild.roles.everyone,
					deny: [PermissionFlagsBits.ViewChannel],
				},
			],
		});
	}
	pending.tickets[ticket.id] = {
		userId: data.userId,
		name: data.ticket.title,
		description: data.ticket.description,
		status: 1,
	};

	await ticket.send({ embeds: [embed], content: `<@${data.userId}>` }).then(async message => {
		await wait(2000);
		message.edit({ content: '' });
	});

	fs.writeFileSync(path.join(__dirname, '/data.json'), JSON.stringify(pending, null, 2));
	return ticket.id;
};

const close = async (client, ticketId, user) => {
	const ticket = await client.channels.fetch(ticketId);
	const pending = require('./data.json');


	pending.tickets[ticketId].status = 0;
	pending.tickets[ticketId].dateClosed = new Date();

	ticket.permissionOverwrites.create(pending.tickets[ticketId].userId, { SendMessages: false });
	ticket.setName(`(closed) ${pending.tickets[ticketId].name}`);

	embed = new EmbedBuilder()
		.setColor('Blue')
		.setAuthor({ name: `This ticket has been closed by ${user.displayName}`, iconURL: user.displayAvatarURL() })
		.setTimestamp();

	await ticket.send({ embeds: [embed] });

	fs.writeFileSync(path.join(__dirname, '/data.json'), JSON.stringify(pending, null, 2));
};

const reopen = async (client, ticketId, user) => {
	const ticket = await client.channels.fetch(ticketId);
	const pending = require('./data.json');


	pending.tickets[ticketId].status = 1;
	delete pending.tickets[ticketId].dateClosed;

	ticket.permissionOverwrites.create(pending.tickets[ticketId].userId, { SendMessages: true });
	ticket.setName(pending.tickets[ticketId].name);

	embed = new EmbedBuilder()
		.setColor('Blue')
		.setAuthor({ name: `This ticket has been reopened by ${user.displayName}`, iconURL: user.displayAvatarURL() })
		.setTimestamp();

	await ticket.send({ embeds: [embed] });

	fs.writeFileSync(path.join(__dirname, '/data.json'), JSON.stringify(pending, null, 2));
};

const deleteTickets = async (client) => {
	const pendingJson = fs.readFileSync('data/data.json');
	const pendingData = JSON.parse(pendingJson);
	const deletedTickets = [0, ''];

	const today = new Date();

	for (const ticket in pendingData.tickets) {
		if (pendingData.tickets[ticket].status == 0 && pendingData.tickets[ticket].dateClosed != null) {
			let dateClosed = new Date(pendingData.tickets[ticket].dateClosed);
			dateClosed = new Date(dateClosed.getTime() + 8.64e+7);

			if (today.getTime() > dateClosed.getTime()) {
				const user = await client.users.fetch(pendingData.tickets[ticket].userId);
				deletedTickets[0]++;
				deletedTickets[1] = deletedTickets[1] + `\n\n**❌ "${pendingData.tickets[ticket].name}"** for **${user.displayName}**`;
				delete pendingData.tickets[ticket];
				try {
					const channel = await client.channels.fetch(ticket);
					await channel.delete();
				} catch (error) {console.error(error);}
			}
		}
	}
	await fs.writeFileSync(path.join(__dirname, '/data.json'), JSON.stringify(pendingData, null, 2));
	if (deletedTickets[0] > 0) {
		embed = new EmbedBuilder()
			.setTitle('Ticket deletion completed')
			.setColor('Gold')
			.setTimestamp();

		if (deletedTickets[0] == 1) {
			embed.setDescription(`**✅ Successfully deleted ${deletedTickets[0]} ticket**${deletedTickets[1]}`);
		} else {
			embed.setDescription(`**✅ Successfully deleted ${deletedTickets[0]} tickets**${deletedTickets[1]}`);
		}

		const channel = await client.channels.fetch(logChannel);
		await channel.send({ embeds: [embed] });
	}
};


module.exports = {
	openTicket: open,
	closeTicket: close,
	reopenTicket: reopen,
	deleteTickets: deleteTickets,
};
