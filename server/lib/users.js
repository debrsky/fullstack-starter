const config = require('../../config.js');
const fs = require('fs').promises;
const path = require('path');

const usersFile = path.join(config.rootDir, config.storage, 'users.json');

async function getUserById(id) {
	const users = JSON.parse(await fs.readFile(usersFile, 'utf-8'));
	return users.find((user) => user.id === id);
}

async function getUserByNamePassword(username, password) {
	const users = JSON.parse(await fs.readFile(usersFile, 'utf-8'));
	const user = users.find((user) => user.name === username);
	if (!user) return null;

	if (!user.password === password) return null;

	return user;
}

module.exports = {getUserById, getUserByNamePassword};
