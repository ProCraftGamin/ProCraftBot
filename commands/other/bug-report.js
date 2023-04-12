const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const { logChannel } = require('../../config.json');

/* TODO
- Add notification choice
- Finish status changing system
- add more buttons?
- add message when the bug is patched
*/

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bug-report')
		.setDescription('Report a bug you found.')
		.addStringOption(option =>
			option.setName('description')
				.setDescription('Description of the bug')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('replication-steps')
				.setDescription('Steps to replicate the bug')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('notifications')
				.setDescription('Would you like notifications on the bug status?')
				.setRequired(true)
				.addChoices(
					{ name: 'Yes', value: 'true' },
					{ name: 'No', value: 'false' },
				)),
	async execute(interaction) {

		// initial response so interaction doesnt fail
		let embed = new EmbedBuilder()
			.setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: 'Submitting your report...' })
			.setColor('Blue');
		await interaction.reply({ embeds: [embed], ephemeral: true });


		// parse pending file JSON
		const pendingJson = fs.readFileSync('data/pending.json');
		const pendingFile = JSON.parse(pendingJson);

		// define ID (basically just a counter), description, replication steps, and notification boolean
		const id = Object.keys(pendingFile['bug reports']).length + 1;
		const description = interaction.options.getString('description');
		const replicationSteps = interaction.options.getString('replication-steps');
		const notifications = (interaction.options.getString('notifications') == 'true');


		// create log embed
		embed = new EmbedBuilder()
			.setColor('Red')
			.setAuthor({ name: 'Bug report', iconURL: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficon-library.com%2Fimages%2Ficon-bug%2Ficon-bug-14.jpg&f=1&nofb=1&ipt=e06d000dfb247da25c4c17320eb9490fb2059a48693ad9a2e53fd03f2763ff51&ipo=images' })
			.setDescription(`***Description:*** ${description}\n***Replication steps:*** ${replicationSteps}\n\n***Status:*** *‼️ Pending*`)
			.setFooter({ text: `Submitted by ${interaction.user.username} • Report ID: ${id}`, iconURL: interaction.user.displayAvatarURL() })
			.setTimestamp();

		// create log action row
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(`d|bug|${id}|status`)
					.setLabel('📄 Change status')
					.setStyle(ButtonStyle.Secondary),
			);

		// send to log channel
		await interaction.client.channels.cache.get(logChannel).send({ embeds: [embed], components: [row] }).then(message => {
			// save to pending file
			pendingFile['bug reports'][id] = {
				'message-id': message.id,
				'description': description,
				'replication-steps': replicationSteps,
				'status': 0,
				'user': {
					'username': interaction.user.username,
					'avatar': interaction.user.displayAvatarURL(),
					'id': interaction.user.id,
					'notifications': notifications,
				},
			};

			fs.writeFileSync('data/pending.json', JSON.stringify(pendingFile, null, 2));
		});


		// response embed
		embed = new EmbedBuilder()
			.setColor('DarkGreen')
			.setAuthor({ name: 'Your bug report has been submitted! Thank you!', iconURL: interaction.user.displayAvatarURL() })
			.setDescription(`• ***Description:*** ${description}\n• ***Replication steps:*** ${replicationSteps}\n• ***ID***: ${id}`);

		// edit reply
		await interaction.editReply({ embeds: [embed] });
	},
};