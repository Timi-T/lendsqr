/* eslint import/no-extraneous-dependencies: 'off' */

// Data model for user object

const uuid = require('uuid');
const sha1 = require('sha1');

// Class to implement a user object
class User {
  constructor(
    firstname,
    lastname,
    username,
    email,
    phone,
    password = 'null',
    walletId = null,
    balance = 0,
  ) {
    this.userId = uuid.v4();
    this.firstname = firstname;
    this.lastname = lastname;
    this.username = username;
    this.email = email;
    this.phone = phone;
    this.password = sha1(password);
    this.walletId = walletId;
    this.balance = balance;
  }
}

module.exports = User;
