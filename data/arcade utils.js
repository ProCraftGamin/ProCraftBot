const fs = require('fs');

const getBal = (userId) => {
	const balances = fs.readFileSync('C:/Users/procr_sriu2y2/Desktop/Discord bots/ProCraftBot/data/balances.txt').toString().split('\n');
	for (const balance of balances) {
		const balanceS = balance.split('|');
		if (balanceS[0] == userId) {
			return balanceS[1];
		}
	}
	return null;
};
const setBal = (userId, bal) => {
	let userFound = false;
	const balFile = fs.readFileSync('C:/Users/procr_sriu2y2/Desktop/Discord bots/ProCraftBot/data/balances.txt').toString().split('\n');
	for (let i = 0; i < balFile.length; i++) {
		const userS = balFile[i].split('|');
		if (userS[0] == userId) {
			balFile[i] = `${userId}|${bal}`;
			userFound = true;
		}
	}
	if (!userFound) {
		return null;
	}
	let balFileNew = '';
	for (let i = 0; i < balFile.length; i++) {
		if (i === balFile.length - 1) {
			balFileNew = `${balFileNew}${balFile[i]}`;
		} else {
			balFileNew = `${balFileNew}${balFile[i]}\n`;
		}
	}
	fs.writeFileSync('C:/Users/procr_sriu2y2/Desktop/Discord bots/ProCraftBot/data/balances.txt', balFileNew);
	return 1;
};

const addBal = (userId, plus) => {
	const balRaw = getBal(userId);
	if (!balRaw) {
		return null;
	}
	let bal = parseInt(balRaw);
	bal = bal += plus;
	setBal(userId, bal);
	return bal;
};

const removeBal = (userId, minus) => {
	const balRaw = getBal(userId);
	if (!balRaw) {
		return null;
	}
	let bal = parseInt(balRaw);
	bal = bal -= minus;
	setBal(userId, bal);
	return bal;
};

const transferBal = (user1Id, user2Id, amount) => {
	let status = removeBal(user1Id, amount);
	if (!status) {
		return null;
	}
	status = addBal(user2Id, amount);
	if (!status) {
		addBal(user1Id, amount);
		return null;
	}
	return 1;
};

exports.transferBal = transferBal;
exports.removeBal = removeBal;
exports.addBal = addBal;
exports.getBal = getBal;
exports.setBal = setBal;