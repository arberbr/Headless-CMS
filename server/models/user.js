const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true
		},
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
			required: true
		},
		work: String,
		location: String,
		socials: {
			type: Schema.Types.ObjectId,
			ref: 'Social'
		},
		posts: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Post'
			}
		]
	},
	{
		timestamps: true
	}
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
