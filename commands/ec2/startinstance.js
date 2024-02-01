const { SlashCommandBuilder } = require('discord.js');
const { awsconf } = require('../../config.json');
const { startInstance } = require('../../modules/instancelifecycle');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('startinstance')
		.setDescription('インスタンスを起動します'),
	execute: async function(interaction) {
		console.log(interaction.user.id)
    const message = await startInstance(awsconf.instanceId);
    await interaction.reply(message);
	},
};




