/* eslint import/no-extraneous-dependencies: "off" */
/* eslint no-undef: "off" */
/* eslint prefer-arrow-callback: "off" */

// This is a script to test all bank wallet transaction related endpoints

const { expect } = require('chai');
const { describe } = require('mocha');
const request = require('request');
const utils = require('util');
const db = require('../db/db');
const User = require('../dataObjects/userObject');

// Test all transfers endpoints
describe('Test all transfers endpoints', function testTransfer() {
  // Define global variables
  let token1 = null;
  let getOptions = null;
  let postOptions = null;

  // Create two users to transfer funds between
  it('0. Setup users', async function createUsers() {
    const user1 = new User('first', 'last', 'user1', 'email1', 'phone1', 'password', 1234, 20000);
    const user2 = new User('second', 'third', 'user2', 'email2', 'phone2', 'password', 5678, 20000);

    // Save users in database
    await db.post('lend_users', user1);
    await db.post('lend_users', user2);

    // Login user 1
    const options = {
      url: 'http://127.0.0.1:5000/api/v1/login',
      json: true,
      body: {
        username: 'user1',
        password: 'password',
      },
    };
    const loginUser = utils.promisify(request.post);
    const response1 = await loginUser(options);
    token1 = response1.body.success.token;

    // Define get options
    getOptions = {
      url: 'http://127.0.0.1:5000/api/v1/transfers',
      json: true,
      headers: {
        authorization: token1,
      },
    };

    // Define post options
    postOptions = {
      url: 'http://127.0.0.1:5000/api/v1/transfer',
      json: true,
      headers: {
        authorization: token1,
      },
    };
  });

  // Test making a transfer from a user to another with auth
  it(
    '1. Test making transfer from user1 to user2 with auth',
    function transferWithAuth(done) {
      postOptions.body = {
        amount: 5000,
        destinationUsername: 'user2',
      };
      request.post(postOptions, (err, res) => {
        expect(res.statusCode).to.be.equal(200);
        db.get('lend_users', { username: 'user1' })
          .then((user) => {
            const { balance } = user.data[0];
            expect(balance).to.be.equal(15000);
            db.get('lend_users', { username: 'user2' })
              .then((user2) => {
                const balance2 = user2.data[0].balance;
                expect(balance2).to.be.equal(25000);
                done();
              });
          });
      });
    },
  );

  // Test making a transfer with Insufficient funds
  it(
    '2. Test making a transfer with Insufficient funds',
    function transferWithInsufficientFunds(done) {
      postOptions.body = {
        amount: 50000,
        destinationUsername: 'user2',
      };
      request.post(postOptions, (err, res) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      });
    },
  );

  // Test making a transfer from a user to another without amount
  it(
    '3. Test making a transfer from user1 to user2 without amount',
    function transferWithoutAmount(done) {
      postOptions.body = {
        destinationUsername: 'user2',
      };
      request.post(postOptions, (err, res) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      });
    },
  );

  // Test making a transfer from a user to another without destinationUsername
  it(
    '4. Test making a transfer from user1 to user2 without destinationUsername',
    function transferWithoutUsername(done) {
      postOptions.body = {
        amount: 5000,
      };
      request.post(postOptions, (err, res) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      });
    },
  );

  // Test making a transfer from a user to another with wrong destinationUSername
  it(
    '5. Test making a transfer from user1 to user2 without amount',
    function transferWithWrongUsername(done) {
      postOptions.body = {
        amount: 5000,
        destinationUsername: 'no',
      };
      request.post(postOptions, (err, res) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      });
    },
  );

  // Test getting all transfers for a user with auth
  it(
    '6. Test getting all transfers for a user with auth',
    function getTransfersWithAuth(done) {
      request.get(getOptions, (err, res) => {
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    },
  );

  // Test getting all transactions for a user with auth
  it(
    '7. Test getting all transactions for a user with auth',
    function getTransactionsWithAuth(done) {
      const options = {
        url: 'http://127.0.0.1:5000/api/v1/transactions',
        json: true,
        headers: {
          authorization: token1,
        },
      };
      request.get(options, (err, res) => {
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    },
  );

  // Test making a transfer from a user to another without auth
  it(
    '8. Test making transfer from user1 to user2 without auth',
    function transferWithoutAuth(done) {
      postOptions.body = {
        amount: 5000,
        destinationUsername: 'user2',
      };
      postOptions.headers.authorization = 'none';
      request.post(postOptions, (err, res) => {
        expect(res.statusCode).to.be.equal(403);
        done();
      });
    },
  );

  // Test getting all transfers for a user without auth
  it(
    '9. Test getting all transfers for a user without auth',
    function getTransfersWithAuth(done) {
      getOptions.headers.authorization = 'none';
      request.get(getOptions, (err, res) => {
        expect(res.statusCode).to.be.equal(403);
        done();
      });
    },
  );

  // Test getting all transactions for a user without auth
  it(
    '10. Test getting all transactions for a user without auth',
    function getTransactionsWithoutAuth(done) {
      const options = {
        url: 'http://127.0.0.1:5000/api/v1/transactions',
        json: true,
        headers: {
          authorization: 'none',
        },
      };
      request.get(options, (err, res) => {
        expect(res.statusCode).to.be.equal(403);
        done();
      });
    },
  );

  // Delete users from database
  this.afterAll(async function deleteUser() {
    // Delete all created users
    await db.del('lend_users', { username: 'user1' });
    await db.del('lend_users', { username: 'user2' });
  });
});
