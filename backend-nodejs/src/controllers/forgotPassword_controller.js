const express = require('express');
const app = express();

const User = require('../models/User');
app.use(express.urlencoded());

const ForgotPassword = require('../models/ForgotPassword');
const crypto = require('crypto');
// const nodemailer = require('../config/nodemailer');
// const forgotPasswordMailer = require('../mailers/forgot_password_mailer');

// render the forgot-password page
module.exports.forgotPassword = function(req, res){

    return res.render('forgot_password', {
            title: "Codeial | Forgot Password"
    });
}


//forgot password link sender
module.exports.forgotPasswordLinkSend = function(req, res){
    const email = req.body.email;
    User.findOne({ email: email }, function(err, user) {
        if (err) {
            console.log(err);
        }
        if (!user) {
            res.json({ success: false, message: 'No account with that email address exists.' });
        } else {
            // create reset token
            const resetToken = crypto.randomBytes(20).toString('hex');
            // set reset token and expiry
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            user.save(function(err) {
                if (err) {
                    console.log(err);
                }
                // send email with reset token
                forgotPasswordMailer.forgotPasswordLink(user);
            });

        }
        
        return res.render('user_sign_in', {
            title: "Codeial | Sign In"
        })
        
    });
}