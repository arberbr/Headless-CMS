const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const authHeader = req.get('Authorization');

	if (!authHeader) {
		req.isAuth = false;
		return next();
	}

	const token = req.get('Authorization');

	let decodedToken;

	try {
		decodedToken = jwt.verify(token, '93ca7df3d65604374fe04fae03c08ae5');
	} catch (error) {
		req.isAuth = false;
		return next();
	}

	if (!decodedToken) {
		req.isAuth = false;
		return next();
	}

	req.userId = decodedToken.userId;
	req.isAuth = true;

	next();
};
