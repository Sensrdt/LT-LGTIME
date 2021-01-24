'user strict';

const Quiz = require('../models/quiz');
const User = require('../models/user');
const _ = require('lodash');
const controller = require('../middlewares/quiz');
const { validationResult } = require('express-validator');

module.exports = (app) => {
	/**
	 * Add your quiz questions and answers
	 */
	app.post(`/add`, controller.validate('quiz_add'), (req, res) => {
		console.log(req.body);

		const errors = validationResult(req);
		console.log('errors', errors);

		if (!_.isEmpty(errors.errors)) {
			return res.status(406).json(errors.errors);
		}

		const data = [];
		/**
		 * Sanitizing the request body
		 */
		for (let a in req.body.all) {
			let tempObj = {
				question: req.body.all[a].questions,
				id: Math.random(),
				difficulty: req.body.all[a].difficulty,
				options: req.body.all[a].options,
				answer: {
					optionId: req.body.all[a].correct,
				},
			};
			data.push(tempObj);
		}

		console.log(data);

		/**
		 * Inserting questions and answers in the Quiz collection
		 */

		Quiz.insertMany(data)
			.then((result) => {
				console.log('result ', result);
				/**
				 * Sending the whole set of questions back to the user
				 */
				res.status(200).json({ message: 'Questions added', data: result });
			})
			.catch((err) => {
				console.error('error ', err);
				res.status(400).json({ err });
			});
	});

	/**
	 * Get questions by the difficulty
	 */
	app.get(`/question/:d`, (req, res) => {
		console.log(req.params);

		/**
		 * Finding set of 5 questions from Quiz collection
		 */
		Quiz.find({ difficulty: req.params.d }, function (err, result) {
			if (err) {
				res.status(400).json({ err });
			} else {
				/**
				 * Sending the questions with the options back to the users
				 */
				res.status(200).json({ data: result });
			}
		}).limit(5);
	});

	/**
	 * Check the result for the solutions submitted by the user
	 */
	app.post(`/check`, controller.validate('check'), (req, res) => {
		console.log(req.body);
		const errors = validationResult(req);
		console.log('errors', errors);

		if (!_.isEmpty(errors.errors)) {
			return res.status(406).json(errors.errors);
		}

		let correct = [];
		/**
		 * Finding questions of a given difficulty
		 */

		Quiz.find({ difficulty: req.body.difficulty }, function (err, result) {
			if (err) {
				res.status(400).json({ err });
			} else {
				req.body.answeredQuestions.map((value) => {
					/**
					 * Sanitizing the array of answered questions from the user
					 */
					if (
						value.selectedOption === 'undefined' ||
						value.selectedOption === 'null' ||
						value.id === 'undefined' ||
						value.id === 'null' ||
						value.id === null ||
						value.selectedOption === null ||
						value.id === undefined ||
						value.selectedOption === undefined
					) {
						res.status(406).json('Inavlid answeredQuestions');
						return;
					} else {
						/**
						 * Filtering out how many answers are right
						 */
						const correctAnswers = result.filter(
							(questions) =>
								questions.id === value.id &&
								questions.answer.optionId === value.selectedOption
						);

						if (!_.isEmpty(correctAnswers)) {
							correct.push(correctAnswers);
						}
					}
				});

				console.log(correct);
				/**
				 * Finding the email in user collection and getting all the existing data
				 */
				User.find({ email: req.body.email }, function (err, users) {
					if (err) {
						res.status(400).json({ err });
					} else {
						console.log('users', users);
						if (!_.isEmpty(users)) {
							let tempScore = [];
							/**
							 * creating an array with new score including the previous scores
							 */
							users[0].score.map((values) => {
								if (values !== null) {
									tempScore.push(values);
								}
							});
							tempScore.push({
								time: new Date().getTime(),
								score: correct.length,
								difficulty: req.body.difficulty,
							});
							/**
							 * Updating the score key of the user collection with the new array which containes score of the latest quiz that user have taken
							 */
							User.update(
								{ email: req.body.email },
								{ score: tempScore },
								function (err, result) {
									if (err) {
										res.status(400).json({ err });
									} else {
										/**
										 * Sending the score as a response back to the user
										 */
										res.status(200).json({ score: correct.length });
									}
								}
							);
						} else {
							res.status(406).json(`No such user with the given email `);
						}
					}
				});
			}
		});
	});
};
