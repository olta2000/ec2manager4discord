const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, awsconf } = require('./config.json');
const { stopServer } = require('./modules/gamemanager');
const { stopInstance } = require('./modules/instancelifecycle');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command){
        console.error(`${interaction.commandName}というコマンドには対応していません。`);
        return;
    }
    try {
        await command.execute(interaction);
        } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
        } else {
            await interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
        }
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    console.log('voiceStateUpdate');
    if (oldState.channelId && !newState.channelId) {
      // そのチャネルにまだ誰かがいるか確認
        const channel = await client.channels.fetch(oldState.channelId);
        if (channel.members.size === 0) {  // 誰もいない場合
            const textChannel = await client.channels.fetch('1200424103555891230');
            textChannel.send('音声チャネルに誰もいなくなったため、インスタンスを停止します。');
	        let msg = await stopServer(awsconf.instanceId);
            textChannel.send(msg);
            await new Promise(resolve => setTimeout(resolve, 2000));
            msg = await stopInstance(awsconf.instanceId);
            textChannel.send(msg);
        }
    }
});
client.login(token);


