const { SlashCommandBuilder } = require('discord.js');
const { awsconf } = require('../../config.json');

const { stopInstance } = require('../../modules/instancelifecycle');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stopinstance')
		.setDescription('インスタンスを停止します'),
	execute: async function(interaction) {
		const message = await stopInstance(awsconf.instanceId);
		await interaction.reply(message);
	}
};
