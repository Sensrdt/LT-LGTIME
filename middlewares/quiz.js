const { body, query } = require('express-validator/check');

exports.validate = (method) => {
	switch (method) {
		/**
		 * middleware for validating adding quiz
		 */
		case 'quiz_add':
			return [body('all', 'Invalid data').exists()];

		/**
		 * middleware for validating checking result
		 */
		case 'check':
			return [
				body('email', 'Invalid email').isEmail(),
				body('difficulty', 'Invalid difficulty')
					.isNumeric()
					.custom((val) => {
						if (val <= 0 || val > 3) {
							throw new Error(val);
						}

						return true;
					}),
				body('answeredQuestions', 'Invalid answeredQuestions').exists(),
			];
	}
};
