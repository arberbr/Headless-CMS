const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

module.exports = mongoose.model('Post', postSchema);
