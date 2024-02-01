const { SlashCommandBuilder } = require('discord.js');
const { awsconf } = require('../../config.json');

const { getInstanceIp } = require('../../modules/instancestatus');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverip')
		.setDescription('インスタンスのPublicIPを取得します'),
	execute: async function(interaction) {
		const message = await getInstanceIp(awsconf.instanceId);
		await interaction.reply(message);
	},
};


