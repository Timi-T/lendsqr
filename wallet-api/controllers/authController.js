/* eslint class-methods-use-this: "off" */

// Controller for authentications

require('dotenv').config();
const sha1 = require('sha1');
const jwt = require('jsonwebtoken');
const db = require('../db/db');

// Auth class with methods for performing authentication related operations
class AuthController {
  // Login/Authenticate a user to make requests
  async login(req, res) {
    // Getting body of post request and declaring variables
    const { email } = req.body;
    const { username } = req.body;
    const { password } = req.body;
    let userData = null;

    // Checking that a user with provided email or username exists
    if (username) {
      userData = await db.get('users', { username });
    } else if (email) {
      userData = await db.get('users', { email });
    } else return res.status(401).send({ error: 'Missing username or email address.' });

    // Validating that the username or email exists in the database
    if (userData.data.length === 0) return res.status(400).send({ error: 'Wrong email or username' });

    // Validating the provided password for the user
    const user = { ...userData.data[0] };
    if (!password) return res.status(401).send({ error: 'Missing password' });
    const hashedPwd = sha1(password);
    if (hashedPwd !== user.password) return res.status(401).send({ error: 'Wrong Password.' });

    // Delete user balance
    user.password = sha1(user.password);
    delete user.balance;

    // Create access token for user
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    return res.send({ success: { token: accessToken }, instruction: 'Include the token in the ( Authorization ) header for your request.' });
  }

  // Function to verify a user to make a request
  verifyToken(req, res, next) {
    // Get the authorization header for the request
    const { authorization } = req.headers;
    const token = authorization;

    // When no token is provided
    if (!token) return res.status(401).send({ error: 'Please login to access this endpoint' });

    // Verify provided token
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).send({ error: 'Session expired or wrong token please login to get a new token.' });
      req.user = user;
      return next();
    });
  }
}

// Export an instance of the Auth class
module.exports = new AuthController();
