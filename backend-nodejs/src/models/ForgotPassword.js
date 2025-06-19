const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    accessKey: {
        type: String,
        required: true
    },
    isValid: {
        type: Boolean,
        required: true
    }
},{
    timestamps: true
});

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema);
module.exports = ForgotPassword;