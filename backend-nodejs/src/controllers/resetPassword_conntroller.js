const express = require('express');
const app = express();
const User = require('../models/User');

module.exports.resetPassword = function(req, res) {
    User.findOne({ 
        resetPasswordToken: req.query.token,
        resetPasswordExpires: { $gt: Date() } 
    }, function(err, user) {
        if (err) {
            // Handle error
            req.flash('error', 'Error occured while resetting password');
            console.log("Error in reseting password: ", err);
        } else if (!user) {
            // Invalid or expired token
            req.flash('error', 'Password reset token is invalid or has expired.');
            console.log("User not found");
            return res.render('user_sign_in', {
                title: "Codeial | Sign In"
            });
        } else {
            // Render the password reset form
            res.render('reset_password', {
                title:  'Codeial | Reset Password',
                token: req.query.token
             });
        }
    });
}

module.exports.resetPasswordAction = function(req, res){
    if(req.body.password === req.body.confirm_password){
        User.findOne({ 
            resetPasswordToken: req.body.token,
            resetPasswordExpires: { $gt: Date() } 
        }, function(err, user){
            if(err){
                req.flash('error', 'Password reset token is invalid or has expired.');
                console.log("Error in reseting password: ", err);
            }
            if(user){
                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                user.save();
                console.log("Password updated successfully");
                req.flash('success', 'Password reset successfully, Please login.');
                return res.render('user_sign_in', {
                    title: "Codeial | Sign In"
                });
            }
            else{
                req.flash('error', 'Password reset token is invalid or has expired.');
                console.log("User does not exists or Reset password link expired");
                return res.render('user_sign_in', {
                    title: "Codeial | Sign In"
                });
            }
            
        })
    }else{
        req.flash("error", "Passwords do not match.");
        console.log("Password doesn't match");
        return res.redirect('back');
    }
}