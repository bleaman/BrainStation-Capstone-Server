const knex = require("knex")(require("../knexfile"));

exports.getAllBusinesses = async (req, res) => {
	try {
		const businesses = await knex("businesses").join("users", "businesses.user_id", "=", "users.id").select("businesses.*", "users.name", "users.email");
		if (!businesses) {
			return res.status(404).json({ message: `Businesses not found` });
		}
		return res.json(businesses);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "An error occurred when trying to get all businesses." });
	}
};

exports.getBusinessById = async (req, res) => {
	try {
		const business = await knex("businesses").join("users", "businesses.user_id", "=", "users.id").select("businesses.*", "users.name", "users.email").where("businesses.id", req.params.business_id).first();
		if (!business) {
			return res.status(404).json({ message: `Business not found` });
		}
		return res.json(business);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "An error occurred when trying to get business by id." });
	}
};

exports.getBusinessByUserId = async (req, res) => {
	try {
		const business = await knex("businesses") //prettier-ignore
			.join("users", "businesses.user_id", "=", "users.id")
			.select("businesses.*", "users.name as user_name", "users.email as user_email")
			.where("businesses.user_id", req.params.user_id);
		if (!business) {
			return res.status(404).json({ message: `Business not found` });
		}
		return res.json(business);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "An error occurred when trying to get business by user id." });
	}
};

exports.createBusiness = async (req, res) => {
	const { bizname, bizdescription, bizlocation, bizphone, bizimg, bizcategory } = req.body;
	if (!bizname) {
		return res.status(400).json({ message: "Please enter a business name." });
	}
	if (!bizcategory) {
		return res.status(400).json({ message: "Please enter a business category." });
	}
	try {
		const business = await knex("businesses").insert({ bizname, bizdescription, bizlocation, bizphone, bizimg, bizcategory, user_id: Number(req.userId) });
		return res.json(business);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "An error occurred when trying to create a business." });
	}
};

exports.updateBusiness = async (req, res) => {
	const adminCheck = await knex("users").select().where("id", req.userId).first();
	if (!adminCheck) {
		return res.status(404).json({ message: `User not found` });
	}
	const apiAdmin = adminCheck.api_admin;
	const businessData = await knex("businesses").select("user_id").where("businesses.id", req.params.business_id).first();
	if (!businessData) {
		return res.status(404).json({ message: `Business not found` });
	}
	if (businessData.user_id !== Number(req.userId)) {
		if (!apiAdmin) {
			return res.status(403).json({ message: "You are not authorized to update this business." });
		}
	}
	const { bizname, bizdescription, bizlocation, bizphone, bizimg, bizcategory } = req.body;
	if (!bizname) {
		return res.status(400).json({ message: "Please enter a business name." });
	}
	if (!bizdescription) {
		return res.status(400).json({ message: "Please enter a business description." });
	}
	if (!bizlocation) {
		return res.status(400).json({ message: "Please enter a business location." });
	}
	if (!bizphone) {
		return res.status(400).json({ message: "Please enter a business phone number." });
	}
	if (!bizimg) {
		return res.status(400).json({ message: "Please enter a business image." });
	}
	if (!bizcategory) {
		return res.status(400).json({ message: "Please enter a business category." });
	}
	try {
		const business = await knex("businesses").update({ bizname, bizdescription, bizlocation, bizphone, bizimg, bizcategory }).where("id", req.params.business_id);
		if (!business) {
			return res.status(404).json({ message: `Business not found` });
		}
		return res.json({ message: `${business.bizname} updated` });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "An error occurred when trying to update business information." });
	}
};

exports.deleteBusiness = async (req, res) => {
	const user = await knex("users").select().where("id", req.userId).first();
	if (!user) {
		return res.status(404).json({ message: `User not found` });
	}
	const apiAdmin = user.api_admin;
	if (!apiAdmin) {
		return res.status(401).json({ message: `You must be an admin to perform this action.` });
	}
	try {
		const bizData = await knex("businesses").select("*").where("id", req.params.business_id);
		const business = await knex("businesses").delete().where("id", req.params.business_id);
		if (!business) {
			return res.status(404).json({ message: `Business not found` });
		}
		return res.json({ message: `${bizData.bizname} deleted` });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: `An error occurred when trying to delete business.` });
	}
};

exports.likeBusiness = async (req, res) => {
	try {
		const business = await knex("businesses").select().where("id", req.params.business_id).first();
		if (!business) {
			return res.status(404).json({ message: `Business not found` });
		}
		const likes = await knex("likes")
			.select()
			.where({ user_id: Number(req.userId), business_id: req.params.business_id });
		if (likes.length > 0) {
			return res.status(400).json({ message: `You have already liked ${business.bizname}` });
		}
		await knex("likes").insert({ user_id: Number(req.userId), business_id: req.params.business_id });
		const numlikes = await knex("likes").select().where("business_id", req.params.business_id);
		const numberOfLikes = numlikes.length;
		return res.json({ numberOfLikes });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "An error occurred when trying to like a business." });
	}
};

exports.getLikesByBusinessId = async (req, res) => {
	try {
		const likes = await knex("likes").select().where("business_id", req.params.business_id);
		const numberOfLikes = likes.length;
		function assignStarValue(calcLikes) {
			// Get the number of likes for the business
			let funcLikes = calcLikes;
			// Define the thresholds for each star value
			let thresholds = [10, 20, 50, 100];
			// Loop through the thresholds and compare them with the likes
			for (let i = 0; i < thresholds.length; i++) {
				// If the likes are less than or equal to the current threshold, return the corresponding star value
				if (funcLikes <= thresholds[i]) {
					return i + 1;
				}
			}
			// If the likes are more than the highest threshold, return 5 stars
			return 5;
		}
		starValue = assignStarValue(numberOfLikes);
		return res.json({ NumberOfLikes: numberOfLikes, StarValue: starValue });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "An error occurred when trying to get number of likes by business id." });
	}
};
