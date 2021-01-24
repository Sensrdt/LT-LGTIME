const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const quiz = new mongoose.Schema({
	question: {
		type: String,
		required: true,
		unique: true,
		dropDups: true,
	},
	id: Number,
	difficulty: Number,
	options: [
		{
			id: Number,
			text: String,
		},
	],
	answer: {
		qId: Number,
		optionId: Number,
	},
});
module.exports = mongoose.model('quiz', quiz);
