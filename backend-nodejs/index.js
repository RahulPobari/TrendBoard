const express = require("express");
const cors = require("cors");

const cookieParser = require("cookie-parser");
const passport = require("passport");

if (process.env.NODE_ENV !== "production") {
	// Load environment variables from .env file in non prod environments
	require("dotenv").config()
  }
require("./utils/connectdb");

require('./strategies/JwtStrategy')
require('./strategies/LocalStrategy')
require('./authenticate')

// const userRoute = require('./src/routes/users');
const routes = require('./src/routes/index');

const app = express();

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }));


const session = require("express-session");
app.use(cookieParser(process.env.COOKIE_SECRET))
//Add the client URL to the CORS policy

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : []

// Configure CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Define the HTTP methods you want to allow
  allowedHeaders: 'Content-Type,Authorization', // Define the allowed request headers
  credentials: true, // Allow credentials (cookies, etc.) to be included in the request
};

app.use(cors(corsOptions))

app.use(passport.initialize())
passport.session()

app.use(
	session({
		secret: "secretcode",
		resave: false,
		saveUninitialized: true,
	})
);

// app.use("/api", apiRoute);

// API routes
app.use('/', routes);
// app.use('/api/posts', require('./src/routes/posts'));
// app.use('/api/comments', 
// passport.authenticate('jwt', { session: false }), require('./src/routes/comments'));

//Start the server in port 8080
const server = app.listen(process.env.PORT || 8080, () => {
	const port = server.address().port
	console.log("App started at port:", port)
  })
