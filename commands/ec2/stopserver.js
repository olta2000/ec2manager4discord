const { SlashCommandBuilder } = require('discord.js');
const { awsconf } = require('../../config.json');
const { stopServer } = require('../../modules/gamemanager');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('stopserver')
		.setDescription('ゲームサーバ保存し停止します'),
	execute: async function(interaction) {
		let message = await stopServer(awsconf.instanceId);
		await interaction.reply(message);
	}
}