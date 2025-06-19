const mongoose = require("mongoose");
const url = process.env.MONGO_DB_CONNECTION_STRING;
const connect = mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	// useCreateIndex: true,
});
connect
	.then((db) => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => {
		console.log("MongoDB connection error: ", err);
	});
