const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
	fullname: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	bio: {
		type: String,
		default: 'Hello everyone!'
	},
	avatar: {
		type: String,
		default: process.env.BACKEND_URI + 'images/avatar.png'
	},
	posts: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Post'
		}
	]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
