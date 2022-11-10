/* eslint class-methods-use-this: 'off' */

// Controller for user related endpoints

const db = require('../db/db');

// Importing the USER data model
const User = require('../dataObjects/userObject');

// Function to validate parameters to create a user.
function validationError(firstname, lastname, username, email, phone, password) {
  if (!firstname) return { error: 'Missing firstname' };
  if (!lastname) return { error: 'Missing lastname' };
  if (!username) return { error: 'Missing username' };
  if (!email) return { error: 'Missing email' };
  if (!phone) return { error: 'Missing phone number' };
  if (!password) return { error: 'Missing password' };
  return false;
}

// User class with methods for performing user related operations
class UserController {
  // Method to create a user
  async createUSer(req, res) {
    // Getting body of post request and declaring variables
    const { firstname } = req.body;
    const { lastname } = req.body;
    const { username } = req.body;
    const { email } = req.body;
    const { phone } = req.body;
    const { password } = req.body;
    const balance = 0;
    const walletId = [...Array(8)].map(() => {
      const num = String(Math.random() * 10)[0];
      return Number(num);
    }).join('');

    // Validating provided data
    const err = validationError(firstname, lastname, username, email, phone, password);
    if (err) return res.status(400).send(err);

    // Checking to make sure provided data is unique
    const usernameExists = await db.get('users', { username });
    const emailExists = await db.get('users', { email });
    const phoneExists = await db.get('users', { phone });
    if (usernameExists.data.length > 0) return res.status(400).send({ error: 'Username is taken already.' });
    if (emailExists.data.length > 0) return res.status(400).send({ error: 'Account with this email already exists.' });
    if (phoneExists.data.length > 0) return res.status(400).send({ error: 'Account with this phone number already exists.' });

    // Create a new user in the database
    const user = new User(firstname, lastname, username, email, phone, password, walletId, balance);
    await db.post('users', user);
    return res.send({ success: `User ${username} has been created` });
  }

  // Method to get all registered users
  async allUsers(req, res) {
    // Get page number for pagination
    let { page } = req.query;

    // Check if page is of type int
    try {
      Number(page);
      if (!page) { page = 1; }
    } catch {
      page = 1;
    }

    // Get users from database
    const users = await db.get('users', null, Number(page), 10);

    // Delete Personal Identifiable Information (PII)
    const newUsers = users.data.map((user) => ({
      userId: user.user_d,
      firstname: user.firstname,
      lastname: user.lastname,
      walletId: user.wallet_id,
    }));

    // Increment page number for next pagination and check if we are on last page
    let nextPage = Number(page) + 1;
    if (!users.pagination.lastPage || users.pagination.lastPage === page) {
      nextPage = null;
    }

    return res.send(
      {
        _links: {
          self: { href: `/users?page=${page}` },
          next: { href: `/users?page=${nextPage}` },
        },
        results: newUsers,
      },
    );
  }

  // Method to get a user from the database
  async getUser(req, res) {
    // Get the walletId or wallet-username from the request url parameters
    const { walletId } = req.query;
    const { username } = req.query;
    let userData = null;

    // When we have a username or walletId
    if (walletId || username) {
      // Get user from database using walletID or username
      if (walletId) {
        userData = await db.get('users', { wallet_id: walletId });
      } else {
        userData = await db.get('users', { username });
      }

      // When no user is found
      if (userData.data.length === 0) return res.status(404).send({ error: 'User not found' });

      // Returning username, userId and walletId
      const user = userData.data[0];
      const data = { userId: user.user_id, username: user.username, walletId: user.wallet_id };
      return res.send(data);
    }
    // When no url parameter is found
    return res.status(404).send({ error: 'User not found. Include walletId or username as a request parameter' });
  }
}

// Export an instance of the user class
module.exports = new UserController();
