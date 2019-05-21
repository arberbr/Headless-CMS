const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSocialSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	github: String,
	website: String,
	linkedin: String,
	facebook: String,
	stackoverflow: String
});

module.exports = mongoose.model('Social', userSocialSchema);
