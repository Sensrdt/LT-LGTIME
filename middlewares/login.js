const { body, query } = require('express-validator/check');

exports.validate = (method) => {
	switch (method) {
		/**
		 * middleware for validating register user
		 */
		case 'register':
			return [
				body('email', 'Invalid email').isEmail(),
				body('password', 'Invalid Password')
					.isString()
					.custom((val) => {
						if (val === 'undefined' || val === 'null' || val === '') {
							throw new Error(val);
						}

						return true;
					}),
			];
		/**
		 * middleware for validating login user
		 */
		case 'login':
			return [
				body('email', 'Invalid email').isEmail(),
				body('password', 'Invalid Password')
					.isString()
					.custom((val) => {
						if (val === 'undefined' || val === 'null' || val === '') {
							throw new Error(val);
						}

						return true;
					}),
			];
	}
};
