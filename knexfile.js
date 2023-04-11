require("dotenv").config();

module.exports = {
	client: "mysql2",
	connection: {
		charset: "utf8mb4",
		host: process.env.DB_LOCAL_HOST,
		port: process.env.DB_LOCAL_PORT,
		database: process.env.DB_LOCAL_DBNAME,
		user: process.env.DB_LOCAL_USER,
		password: process.env.DB_LOCAL_PASSWORD,
	},
};
