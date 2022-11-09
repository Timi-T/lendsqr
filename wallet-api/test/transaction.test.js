// This is a script to test all transaction related endpoints

const { expect } = require('chai');
const { describe } = require('mocha');
const request = require('request');
const sinon = require('sinon');
const db = require('../db/db');
const utils = require('util')
const User = require('../dataObjects/userObject');
const Transfer = require('../dataObjects/TransferObject');
const BankWalletTransaction = require('../dataObjects/bankWalletTransactionObject');

// Test all transaction endpoints
describe('Test for all transaction endpoints', function testDeposit() {
  this.beforeAll(async function createUser() {
    // Create a user object
    this.user1 = new User('first1', 'last1', 'user1', 'email1', 'phone1', 'password');

    // Save a user in database
    await db.post('users', this.user1);

    // Login the user
    const options = {
      url: 'http://127.0.0.1:5000/api/v1/login',
      json: true,
      body: {
        username: 'user1',
        password: 'password',
      }
    }
    const loginUser = utils.promisify(request).bind(post);
    const response = await loginUser(options);
    console.log(response.body);

    // Define post options
    this.options = {
      url: 'http://127.0.0.1:5000/api/v1/deposit',
      json: true,
      headers: {
        authorization: token,
      }
    }
  });

  // Delete user from database 
  this.afterAll(async function deleteUser() {
    // Delete all created users
    await db.del('users', { username: 'user1' });
  });
});