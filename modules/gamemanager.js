const { awsconf } = require('../../config.json');
const AWS = require('aws-sdk');
AWS.config.update({region: 'ap-northeast-1'});
const ssm = new AWS.SSM({apiVersion: '2014-11-06'});

const { instanceStatus } = require('./instancestatus');

async function stopServer(instance_id){
	let params = {
		InstanceIds: [ instance_id ]
	};
	try {
        const status = await instanceStatus(instance_id);
        if(status !== 'running'){
            return `インスタンスが実行中ではありません。現在の状態: ${status}`;
        }
		const commandParams = {
			DocumentName: "AWS-RunShellScript",
			InstanceIds: params.InstanceIds,
			Parameters: {
				'commands': [awsconf.stopScriptPath]
			},
		};
		let command = await ssm.sendCommand(commandParams).promise();
		await new Promise(resolve => setTimeout(resolve, 2000)); // 2秒待つ
		let invocationParams = {
			CommandId: command.Command.CommandId,
			InstanceId: instance_id
		};
		const  result = await ssm.getCommandInvocation(invocationParams).promise();
		if(result.Status === 'Success'){
			return "ゲームサーバは保存され、終了しました。";
		}
		else {
			return "何らかの理由でゲームサーバが終了されませんでした。インスタンスを終了するか、管理者に報告してください"
		}
	}
	catch (err) {
			console.log("Error", err);
			return `エラーが発生しました: ${err.message}`;
	}
}
module.exports = {
    stopServer
};
