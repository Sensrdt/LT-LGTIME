'user strict';

const Login = require('../models/login');
const User = require('../models/user');
const controller = require('../middlewares/login');
const { validationResult } = require('express-validator');
const _ = require('lodash');

module.exports = (app) => {
	/**
	 * Registering user with email and password
	 */
	app.post(`/register`, controller.validate('register'), (req, res) => {
		console.log(req.body);

		const errors = validationResult(req);
		console.log('errors', errors);

		if (!_.isEmpty(errors.errors)) {
			return res.status(406).json(errors.errors);
		}

		let login = new Login(req.body);

		/**
		 * Finding whether the user already exist in the Login collection by their email
		 */
		Login.find({ email: req.body.email }, function (err, doc) {
			if (err) {
				res.status(500).json('Something went wrong');
			}

			if (doc.length) {
				return res.status(409).json({ message: 'Email already exist' });
			} else {
				/**
				 * If the user not present then saving it as a new user
				 */
				login.save(function (err, doc) {
					if (err) {
						res.status(500).json('Something went wrong');
					}

					let user = new User({ email: req.body.email });

					/**
					 * Also adding the user into the user collection for storing the scores later
					 */
					user.save(function (err, result) {
						if (err) {
							res.status(500).json('Something went wrong');
						}

						if (result !== null) {
							/**
							 *  Sending the email and password in response to the user
							 */
							return res.status(201).json({
								message:
									'Your account has been created successfully. Please login to continue.',
								data: doc,
							});
						}
					});
				});
			}
		});
	});

	/**
	 * Login to the application
	 */
	app.post(`/login`, controller.validate('login'), (req, res) => {
		console.log(req.body);

		const errors = validationResult(req);
		console.log('errors', errors);

		if (!_.isEmpty(errors.errors)) {
			return res.status(406).json(errors.errors);
		}

		/**
		 * Finding the user based on the email
		 */
		Login.findOne(
			{ email: req.body.email, password: req.body.password },
			function (err, user) {
				if (err) {
					res.status(500).json('Something went wrong');
				}

				if (user != null) {
					/**
					 * Sending loggedIn true in response to the user
					 */
					return res.status(200).json({ loggedIn: true });
				} else {
					return res.status(409).json({ message: `Wrong credentials` });
				}
			}
		);
	});
};
