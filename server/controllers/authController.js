const authService = require('../services/authService');

exports.signup = authService.signup;
exports.login = authService.login;
exports.logout = authService.logout;
