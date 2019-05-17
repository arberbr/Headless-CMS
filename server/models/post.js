const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const postSchema = new Schema(
	{
		title: {
			type: String,
			required: true
		},
		content: {
			type: String,
			required: true
		},
		excerpt: {
			type: String,
			required: false
		},
		slug: {
			type: String,
			required: true,
			unique: true
		},
		image: {
			type: String,
			required: false
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	},
	{
		timestamps: true
	}
);

postSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Post', postSchema);
