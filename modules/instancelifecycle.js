const AWS = require('aws-sdk');
AWS.config.update({region: 'ap-northeast-1'});
const ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
const { instanceStatus } = require('./instancestatus');

async function startInstance(instance_id){
    try {
        const status = await instanceStatus(instance_id);
        if(status !== 'stopped'){
            return `インスタンスは ${status} 状態です。`;
        }
        let params = {
            InstanceIds: [ instance_id ]
        };
        const data = await ec2.startInstances(params).promise();
        console.log("Success: start instance!", data.StartingInstances);
        return "インスタンスの起動に成功しました。";
    }
    catch(err){
        console.log("Error", err);
        return `エラーが発生しました: ${err.message}`;
    }
}
async function stopInstance(instance_id){
	try {
        const status = await instanceStatus(instance_id);
        if(status !== 'running'){
            return `インスタンスは ${status} 状態です。`;
        }
        let params = {
            InstanceIds: [ instance_id ]
        };
		await ec2.stopInstances(params).promise();
		return "インスタンスの停止に成功しました。";
	}
	catch (err) {
		console.log("Error", err);
		return `エラーが発生しました: ${err.message}`;
	}
};

module.exports = {
    startInstance,
    stopInstance
};