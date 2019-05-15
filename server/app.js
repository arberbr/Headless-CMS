const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const graphqlHttp = require('express-graphql');

// GraphQL Schemas
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

const auth = require('./middlewares/auth');

const app = express();

// Handle application/json Forms
app.use(bodyParser.json()); // application/json

app.use('/images', express.static(path.join(__dirname, 'images')));

// CORS MiddleWare
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'OPTIONS, GET, POST, PUT, PATCH, DELETE'
	);
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization'
	);
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}
	next();
});

app.use(auth);

app.use(
	'/graphql',
	graphqlHttp({
		schema: graphqlSchema,
		rootValue: graphqlResolver,
		graphiql: true,
		customFormatErrorFn: err => {
			if (!err.originalError) return err;

			const data = err.originalError.data;
			const message = err.message || 'An error occurred!';
			const code = err.code || 500;
			return {
				message: message,
				status: code,
				data: data
			};
		}
	})
);

// Error Handling Middleware
app.use((error, req, res, next) => {
	const status = error.statusCode;
	const message = error.message;
	const data = error.data;
	res.status(status).json({
		message: message,
		data: data
	});
});

mongoose
	.connect(process.env.MONGODB, {
		useNewUrlParser: true,
		useFindAndModify: false
	})
	.then(() => {
		app.listen(process.env.PORT || 8080);
	})
	.catch(error => {
		console.log(error);
	});
