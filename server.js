const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 9950;
const routes = require("./routes/routes");

app.use(cors());
app.use("/public/images", express.static("./public/images"));
app.use(express.json());

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use("/api", routes);

// Add route for base URL
app.get("/", (req, res) => {
	res.send("Welcome to Skill Seeker API");
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
