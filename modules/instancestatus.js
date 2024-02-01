const AWS = require('aws-sdk');

AWS.config.update({region: 'ap-northeast-1'});
const ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

async function instanceStatus(instance_id){
	let params = {
		InstanceIds: [ instance_id ]
	};
	try {
		const data = await ec2.describeInstances(params).promise();
		const state = data.Reservations[0].Instances[0].State.Name;
		return state; // インスタンスの状態を直接返す
	} 
	catch (err) {
		console.log("Error", err);
		throw new Error(`エラーが発生しました: ${err.message}`);
	}
};
async function getInstanceIp(instance_id){
	let params = {
		InstanceIds: [ instance_id ]
	};
	try {
		const data = await ec2.describeInstances(params).promise();
		const instance = data.Reservations[0].Instances[0];
		return `インスタンスのPublicIPは ${instance.PublicIpAddress}:8211です。`;
	} 
	catch (err) {
		console.log("Error", err);
		return `エラーが発生しました: ${err.message}`;
	}
};

module.exports = {
    instanceStatus,
    getInstanceIp
};