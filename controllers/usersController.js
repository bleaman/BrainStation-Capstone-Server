require("dotenv").config();
const jwt = require("jsonwebtoken");
const knex = require("knex")(require("../knexfile"));
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const secret = process.env.SECRET;
const emailMailer = process.env.MAILER_EMAIL;
const passwordMailer = process.env.MAILER_PASSWORD;
const hostMailer = process.env.MAILER_HOST;
const portMailer = process.env.MAILER_PORT;
const secureMailer = process.env.MAILER_SECURE;

const transporter = nodemailer.createTransport({
	host: hostMailer,
	port: portMailer,
	secure: secureMailer,
	auth: {
		user: emailMailer,
		pass: passwordMailer,
	},
});

exports.checkGet = async (req, res) => {
	return res.status(400).json({ message: `Login should be a post request.` });
};

exports.getMyProfile = async (req, res) => {
	// const user = await knex("users").select().where("id", req.userId).first();

	const user = await knex("comments") // prettier-ignore
		.join("users", "comments.user_id", "=", "users.id")
		.join("businesses", "comments.business_id", "=", "businesses.id")
		.select("comments.id as comment_id", "comments.comment", "comments.created_at", "users.id as user_id", "users.email as email", "users.name as user_name", "businesses.id as business_id", "businesses.bizname as business_name")
		.where("comments.user_id", req.userId);
	if (!user) {
		return res.status(404).json({ message: `User not found` });
	}
	return res.json(user);
};

exports.getAllUsers = async (req, res) => {
	const user = await knex("users").select().where("id", req.userId).first();
	if (!user) {
		return res.status(404).json({ message: `User not found` });
	}
	const apiAdmin = user.api_admin;
	if (!apiAdmin) {
		return res.status(401).json({ message: `You must be an admin to perform this action.` });
	}
	try {
		const users = await knex("users").select();
		if (!users) {
			return res.status(404).json({ message: `There was an error with the request, please try again.` });
		}
		return res.json(users);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "An error occurred when trying to get all users." });
	}
};

exports.getUserById = async (req, res) => {
	const adminCheck = await knex("users").select().where("id", req.userId).first();
	if (!adminCheck) {
		return res.status(404).json({ message: `User not found` });
	}
	const apiAdmin = adminCheck.api_admin;
	try {
		if (Number(req.userId) === Number(req.params.user_id) || apiAdmin) {
			const user = await knex("users").select().where("id", req.params.user_id).first();
			if (!user) {
				return res.status(404).json({ message: `User not found` });
			}
			return res.json(user);
		} else {
			const user = await knex("users").select("name", "email").where("id", req.params.user_id).first();
			if (!user) {
				return res.status(404).json({ message: `User not found` });
			}
			return res.json(user);
		}
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "An error occurred when trying to get user by id." });
	}
};

exports.createUser = async (req, res) => {
	const { name, email } = req.body;
	if (!name) {
		return res.status(400).json({ message: `Name is required.` });
	}
	if (!email) {
		return res.status(400).json({ message: `Email is required.` });
	}
	const emailCheck = await knex("users").select().where("email", email).first();
	if (emailCheck) {
		return res.status(400).json({ message: `Email already exists.` });
	}
	const plainPassword = req.body.password;
	if (!plainPassword) {
		return res.status(400).json({ message: `Password is required.` });
	}
	const sha256 = crypto.createHash("sha256");
	const hashedPassword = sha256.update(plainPassword).digest("base64");
	try {
		const user = await knex("users").insert({ name, email, password: hashedPassword });
		if (!user) {
			return res.status(404).json({ message: `There was an error with the request, please try again.` });
		}
		const newUser = await knex("users").select().where("email", email).first();
		if (!newUser) {
			return res.status(400).json({ message: `Could not find user after account creation.` });
		}
		const newComment = await knex("comments").insert({ comment: "First Comment", user_id: newUser.id, business_id: 1 });
		if (!newComment) {
			return res.status(400).json({ message: `Initial comment could not be created.` });
		}
		const mailOptions = {
			from: emailMailer,
			to: email,
			subject: "Account Has Been Created",
			text: `Welcome to Skill Seeker! \n \n You can now log in with the email address this email was sent to. \n \n Your password is: *** ${plainPassword} ***. \n \n Enjoy the site!`,
		};
		await transporter.sendMail(mailOptions);
		return res.status(201).json({ message: `${user} created` });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "An error occurred when trying to create a user." });
	}
};

exports.updateUser = async (req, res) => {
	const adminCheck = await knex("users").select().where("id", req.userId).first();
	const apiAdmin = adminCheck.api_admin;

	const { name, email } = req.body;
	if (!name) {
		return res.status(400).json({ message: `Name is required.` });
	}
	if (!email) {
		return res.status(400).json({ message: `Email is required.` });
	}
	const emailCheck = await knex("users").select().where("email", email).first();
	if (emailCheck.length > 0) {
		return res.status(400).json({ message: `Email already exists.` });
	}

	if (Number(req.userId) === Number(req.params.user_id) || apiAdmin) {
		try {
			const user = await knex("users").update({ name, email }).where("id", req.params.user_id);
			if (!user) {
				return res.status(404).json({ message: `User not found` });
			}
			return res.json({ message: `${user} updated` });
		} catch (err) {
			console.error(err);

			return res.status(500).json({ message: "An error occurred when trying to update user information." });
		}
	} else {
		return res.status(401).json({ message: `You can only make changes to your own account.` });
	}
};

exports.updatePassword = async (req, res) => {
	const adminCheck = await knex("users").select().where("id", req.userId).first();
	const apiAdmin = adminCheck.api_admin;

	const { oldpassword, newpassword } = req.body;
	if (!password) {
		return res.status(400).json({ message: `Password is required.` });
	}
	const sha256 = crypto.createHash("sha256");
	const newHashedPassword = sha256.update(newpassword).digest("base64");

	if (oldpassword === adminCheck.password || apiAdmin) {
		try {
			const user = await knex("users").update({ password: newHashedPassword }).where("id", req.params.user_id);
			if (!user) {
				return res.status(404).json({ message: `User not found` });
			}
			return res.json({ message: `${user} updated` });
		} catch (err) {
			console.error(err);

			return res.status(500).json({ message: "An error occurred when trying to update user information." });
		}
	} else {
		return res.status(401).json({ message: `You can only make changes to your own account.` });
	}
};

exports.deleteUser = async (req, res) => {
	const user = await knex("users").select().where("id", req.userId).first();
	const apiAdmin = user.api_admin;
	if (!apiAdmin) {
		return res.status(401).json({ message: `You must be an admin to perform this action.` });
	}
	try {
		const user = await knex("users").delete().where("id", req.params.user_id);
		if (!user) {
			return res.status(404).json({ message: `User not found` });
		}
		return res.json({ message: `${user.name} deleted` });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "An error occurred when trying to delete user." });
	}
};

exports.loginUser = async (req, res) => {
	const { email, password } = req.body;
	if (!email) {
		return res.status(400).json({ message: `Email is required.` });
	}
	if (!password) {
		return res.status(400).json({ message: `Password is required.` });
	}
	function checkPassword(plainPassword, hashedPassword) {
		const sha256 = crypto.createHash("sha256");
		const hash = sha256.update(plainPassword).digest("base64");
		return hash === hashedPassword;
	}
	const user = await knex("users").where("email", email).first();
	if (!user) {
		return res.status(404).json({ message: `User not found` });
	}
	console.log("Login detected from user id:", user.id);
	const hashedPassword = user.password;
	const isPasswordMatch = checkPassword(password, hashedPassword);
	if (!isPasswordMatch) {
		return res.status(401).json({ message: `Password is incorrect.` });
	}
	try {
		const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, secret, { expiresIn: 60 * 60 * 24 }); // Token expires in 24h
		return res.json({ token });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "An error occurred when trying to log in, please retry." });
	}
};

exports.requestPasswordReset = async (req, res) => {
	const token = crypto.randomBytes(20).toString("hex");
	const userEmail = req.body.email;
	if (!userEmail) {
		return res.status(400).json({ message: "Email is required" });
	}
	const user = await knex("users").select().where("email", userEmail).first();
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}
	const userId = user.id;
	try {
		await knex("password_reset_tokens").insert({
			token,
			user_id: userId,
		});
		const resetLink = `http://localhost:3000/forgotpassword/reset/${token}`;
		const mailOptions = {
			from: emailMailer,
			to: userEmail,
			subject: "Password Reset Request",
			text: `We have received a request to reset your password. \n \n If you wish to do so, please click the following link to complete the password reset process. \n \n ${resetLink} \n \n If you did not request a password reset, please ignore this email. \n \n Thank you.`,
		};
		await transporter.sendMail(mailOptions);
		return res.json({ message: "Password reset requested" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "An error occurred when trying to request a new password." });
	}
};
exports.resetPassword = async (req, res) => {
	const newPassword = req.body.password;
	const token = req.body.token;
	if (!newPassword) {
		return res.status(400).json({ message: "New password required." });
	}
	if (!token) {
		return res.status(400).json({ message: "Token required." });
	}
	try {
		const passwordResetToken = await knex("password_reset_tokens").select().where("token", token).first();
		if (!passwordResetToken) {
			return res.status(400).json({ message: "Invalid token" });
		}
		const sha256 = crypto.createHash("sha256");
		const hashedPassword = sha256.update(newPassword).digest("base64");
		await knex("users").update({ password: hashedPassword }).where("id", passwordResetToken.user_id);
		await knex("password_reset_tokens").delete().where("token", token);
		return res.status(200).json({ message: "Password updated" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "An error occurred when trying to reset password." });
	}
};

exports.getIsAdmin = async (req, res) => {
	try {
		const user = await knex("user").select().where("id", req.userId).first();
		const apiAdmin = user.api_admin;
		let isAdmin = false;
		if (apiAdmin) {
			isAdmin = true;
		}

		const responseObject = { isAdmin };
		return res.json(responseObject);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "An error occurred when trying to verify comment ownership." });
	}
};
