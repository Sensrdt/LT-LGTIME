const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const user = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		dropDups: true,
	},
	score: [
		{
			time: String,
			score: Number,
			difficulty: Number,
		},
	],
});
module.exports = mongoose.model('user', user);
