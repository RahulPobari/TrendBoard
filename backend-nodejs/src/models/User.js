// models/user.js
// models/User.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const Session = new Schema({
	refreshToken: {
		type: String,
		default: "",
	},
});

const userSchema = new mongoose.Schema({
	email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    friendship: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

	authStrategy: {
		type: String,
		default: "local",
	},
	refreshToken: {
		type: [Session],
	},
});

//Remove refreshToken from the response
userSchema.set("toJSON", {
	transform: function (doc, res, options) {
		delete res.refreshToken;
		return res;
	},
});

// userSchema.plugin(passportLocalMongoose);

// Configure Passport-Local-Mongoose to use the 'email' field as the username field
userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
  });

const User = mongoose.model("User", userSchema);

module.exports = User;


// const mongoose = require('mongoose');
// const multer = require('multer');
// const path = require('path');
// const AVATAR_PATH = path.join('/uploads/users/avatars');

// const userSchema = new mongoose.Schema({
//     // Define user schema fields here
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     name: {
//         type: String,
//         required: true
//     },
//     avatar: {
//         type: String
//     },
//     friendship: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User'
//         }
//     ],
//     // resetPasswordToken: {
//     //     type: String,
//     // },
//     // resetPasswordExpires: {
//     //     type: Date
//     // }
// }, {
//     timestamps: true
// });

// // let storage = multer.diskStorage({
// //     destination: function (req, file, cb) {
// //       cb(null, path.join(__dirname, '..', AVATAR_PATH));
// //     },
// //     filename: function (req, file, cb) {
// //       const uniqueSuffix = Date.now();
// //       cb(null, file.fieldname + '-' + uniqueSuffix);
// //     }
// // });

// // userSchema.statics.uploadedAvatar = multer({storage: storage}).single('avatar');
// // userSchema.statics.avatarPath = AVATAR_PATH;

// const User = mongoose.model('User', userSchema);

// module.exports = User;


