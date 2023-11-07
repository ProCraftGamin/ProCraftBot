module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {

			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}

		} else if (interaction.isButton()) {
			if (interaction.customId[1] == '|') {
				if (interaction.customId[0] == 'c') {
					return;
				} else {
					const buttonEvent = require(`../buttons/${interaction.customId[0]}`);
					await buttonEvent(interaction);
				}
			} else if (interaction.customId.includes('|')) {
				interaction.deferUpdate();
				const buttonPress = require(`../buttons/${interaction.customId.split('|')[0]}.js`);
				buttonPress(interaction);
			} else {
				const buttonPress = require(`../buttons/${interaction.customId}.js`);
				buttonPress(interaction);
			}

		}
	},
};

