# ec2manager4discord

## Usage
1. リポジトリをクローンする
2. config.jsonを作成する
3. `$ node deploy-commands.js`を実行する
4. `$ node index.js `を実行する

## config.jsonの設定
設定例：
```
{
	"applicationId": "",//for discord
	"guildId": "",//for discord
	"token": "", //discord bot token
	"awsconf":{
		"instanceId":"",
		"stopScriptPath":"",
		"restartScriptPath":""
	}
}

``` 