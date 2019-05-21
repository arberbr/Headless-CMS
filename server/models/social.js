const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSocialSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	github: {
		type: String,
		default: ''
	},
	website: {
		type: String,
		default: ''
	},
	linkedin: {
		type: String,
		default: ''
	},
	facebook: {
		type: String,
		default: ''
	},
	stackoverflow: {
		type: String,
		default: ''
	}
});

module.exports = mongoose.model('Social', userSocialSchema);
