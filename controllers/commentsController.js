const knex = require("knex")(require("../knexfile"));

exports.getAllComments = async (req, res) => {
	try {
		const comments = await knex("comments").join("users", "comments.user_id", "=", "users.id").join("businesses", "comments.business_id", "=", "businesses.id").select("comments.*", "users.name", "businesses.*");
		if (!comments) {
			return res.status(404).json({ message: `Comment not found` });
		}
		return res.json(comments);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "An error occurred when trying to get all comments." });
	}
};

exports.getCommentsByBusinessId = async (req, res) => {
	try {
		const comments = await knex("comments")
			// prettier-ignore
			.join("users", "comments.user_id", "=", "users.id")
			.join("businesses", "comments.business_id", "=", "businesses.id")
			.select("comments.id as comment_id", "comments.comment", "comments.created_at", "users.id as user_id", "users.name as user_name", "businesses.id as business_id", "businesses.bizname as business_name")
			.where("comments.business_id", req.params.business_id);
		if (!comments) {
			return res.status(404).json({ message: `Comment not found` });
		}
		return res.json(comments);
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			message: "An error occurred when trying to get comments by business id.",
		});
	}
};

exports.getCommentByCommentId = async (req, res) => {
	try {
		const comments = await knex("comments")
			// prettier-ignore
			.join("users", "comments.user_id", "=", "users.id")
			.join("businesses", "comments.business_id", "=", "businesses.id")
			.select("comments.id as comment_id", "comments.comment", "comments.created_at", "users.id as user_id", "users.name as user_name", "businesses.id as business_id", "businesses.bizname as business_name")
			.where("comments.id", req.params.comment_id);
		if (!comments) {
			return res.status(404).json({ message: `Comment not found` });
		}
		return res.json(comments);
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			message: "An error occurred when trying to get comments by business id.",
		});
	}
};

exports.getCommentsByUserId = async (req, res) => {
	try {
		const comments = await knex("comments") // prettier-ignore
			.join("users", "comments.user_id", "=", "users.id")
			.join("businesses", "comments.business_id", "=", "businesses.id")
			.select("comments.id as comment_id", "comments.comment", "comments.created_at", "users.id as user_id", "users.name as user_name", "users.email as email", "businesses.id as business_id", "businesses.bizname as business_name")
			.where("comments.user_id", req.params.user_id);
		if (!comments) {
			return res.status(404).json({ message: `Comment not found` });
		}
		return res.json(comments);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "An error occurred when trying to get comments by user id." });
	}
};

exports.createComment = async (req, res) => {
	const { comment } = req.body;
	try {
		const reqcomment = await knex("comments").insert({ comment, user_id: req.userId, business_id: req.params.business_id });
		if (!reqcomment) {
			return res.status(500).json({ message: `An error occured, please try again.` });
		}
		const comments = await knex("comments")
			// prettier-ignore
			.join("users", "comments.user_id", "=", "users.id")
			.join("businesses", "comments.business_id", "=", "businesses.id")
			.select("comments.id as comment_id", "comments.comment", "comments.created_at", "users.id as user_id", "users.name as user_name", "businesses.id as business_id", "businesses.bizname as business_name")
			.where("comments.business_id", req.params.business_id);
		if (!comments) {
			return res.status(404).json({ message: `Comment not found` });
		}
		return res.json(comments);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "An error occurred when trying to create comment." });
	}
};

exports.getCommentOwnership = async (req, res) => {
	try {
		const comment = await knex("comments").select().where("id", req.params.comment_id).first();
		const commentUser = comment.user_id;
		const adminCheck = await knex("users").select().where("id", req.userId).first();
		const apiAdmin = adminCheck.api_admin;
		let ownership = false;
		if (req.userId === commentUser) {
			ownership = true;
		}
		if (apiAdmin) {
			ownership = true;
		}

		const responseObject = { ownership };
		return res.json(responseObject);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "An error occurred when trying to verify comment ownership." });
	}
};

exports.deleteComment = async (req, res) => {
	const user = await knex("users").select().where("id", req.userId).first();
	const apiAdmin = user.api_admin;
	if (!apiAdmin) {
		return res.status(401).json({ message: `You must be an admin to perform this action.` });
	}
	try {
		const commentId = req.params.comment_id;
		const deletedComment = await knex("comments").where("id", commentId).del();
		if (!deletedComment) {
			return res.status(404).json({ message: `Comment with id ${commentId} not found` });
		}
		return res.status(200).json({ message: `Comment ${deletedComment} deleted` });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "An error occurred when trying to delete comment." });
	}
};

exports.updateComment = async (req, res) => {
	const adminCheck = await knex("users").select().where("id", req.userId).first();
	const apiAdmin = adminCheck.api_admin;

	const { comment } = req.body;
	if (!comment) {
		return res.status(400).json({ message: `Comment is required.` });
	}

	const commentCheck = await knex("comments").select("*").where("id", req.params.comment_id).first();

	if (Number(req.userId) === Number(commentCheck.user_id) || apiAdmin) {
		try {
			const doComment = await knex("comments").update({ comment }).where("id", req.params.comment_id);
			if (!doComment) {
				return res.status(404).json({ message: `Comment not found` });
			}
			return res.json({ message: `${doComment} updated` });
		} catch (err) {
			console.error(err);

			return res.status(500).json({ message: "An error occurred when trying to update user information." });
		}
	} else {
		return res.status(401).json({ message: `You can only make changes to your own comments.` });
	}
};
