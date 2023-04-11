const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

module.exports = function verifyToken(req, res, next) {
	const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
	if (!token) return res.sendStatus(401);
	jwt.verify(token, secret, (err, decode) => {
		if (err) return res.sendStatus(401);
		req.userId = decode.id;
		req.userName = decode.name;
		req.userEmail = decode.email;
		next();
	});
};
