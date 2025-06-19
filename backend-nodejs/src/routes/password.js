const express = require('express');
const router = express.Router();

const forgotPasswordController = require('../controllers/forgotPassword_controller');
const resetPasswordController = require('../controllers/resetPassword_conntroller');

router.get('/reset-password-link', resetPasswordController.resetPassword);
router.post('/reset-password', resetPasswordController.resetPasswordAction);

router.get('/forgot-password', forgotPasswordController.forgotPassword);
router.post('/forgot-password-link-send', forgotPasswordController.forgotPasswordLinkSend);

module.exports = router;