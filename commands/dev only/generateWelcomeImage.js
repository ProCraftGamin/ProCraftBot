const { SlashCommandBuilder } = require('discord.js');

/* eslint-disable no-unused-vars */
const { Discord, Guild } = require('discord.js');
const { welcomeChannel } = require('../../config.json');
const Canvas = require('canvas');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('generatewelcomeimage')
		.setDescription('(DEV ONLY)')
		.setDMPermission(false)
		.addUserOption(option =>
			option.setName('user')
				.setDescription('the user to put in the image')
				.setRequired(true)),
	async execute(interaction) {
		interaction.reply({ content: 'Generating image.', ephemeral: true });
		// eslint-disable-next-line no-empty-function
		console.log('Started generating image.');


		const background = 'https://i.imgur.com/SjUYzgT.png';

		const dim = {
			height:675,
			width:1200,
			margin:50,
		};

		const av = {
			size:256,
			x:480,
			y:100,
		};
		const member = interaction.options.getUser('user');
		const username = member.username;

		// const discrim = Guilduser.discriminator;
		const avatarURL = member.avatarURL({ extension: 'png', size: av.size });

		const canvas = Canvas.createCanvas(dim.width, dim.height);
		const ctx = canvas.getContext('2d');

		// draw in the background
		const backimg = await Canvas.loadImage(background);
		ctx.drawImage(backimg, 0, 0);

		// draw black tinted box
		ctx.fillStyle = 'rgba(0,0,0,0.6)';
		ctx.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin);

		const avimg = await Canvas.loadImage(avatarURL);
		ctx.save();

		ctx.beginPath();
		ctx.arc(av.x + av.size / 2, av.y + av.size / 2, av.size / 2, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();

		ctx.drawImage(avimg, av.x, av.y);
		ctx.restore();

		// write in text
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';

		// draw in username
		ctx.font = '60px Minercraftory';
		ctx.fillText(username, dim.width / 2, dim.height - dim.margin - 150);

		// draw in to the server
		ctx.font = '55px Minecraftia';
		ctx.fillText('Welcome to the server!', dim.width / 2, dim.height - dim.margin - 25);

		const attachment = canvas.toBuffer();


		interaction.guild.channels.cache.get(welcomeChannel).send({
			content: `<@${member.id}> Welcome to the server!`,
			files: [attachment],

		});

	},
};