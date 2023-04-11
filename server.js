const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 9950;
const routes = require("./routes/routes");

app.use(cors());
app.use("/public/images", express.static("./public/images"));
app.use(express.json());

app.use("/api", routes);

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
