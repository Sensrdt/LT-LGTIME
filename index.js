const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 9000;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Connecting the mongoDB
 */
mongoose.connect(
	'mongodb+srv://quiz:quiz@cluster0.rke1b.mongodb.net/db?retryWrites=true&w=majority',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	},
	() => {
		console.log('Connected to mongo');
	}
);

/**
 * 1. User Login
 * 2. User Data
 * 3. Questions with dificulty and answers
 * 4. Check answers from user selection and give marks and store to user data
 */

require('./routes/login')(app);
require('./routes/quiz')(app);

app.listen(PORT, () => {
	console.log(`Express server is listening on port ${PORT} `);
});
