const mongoose = require('mongoose');

const Login = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		dropDups: true,
	},
	password: {
		type: String,
		required: true,
	},
});
module.exports = mongoose.model('Login', Login);
