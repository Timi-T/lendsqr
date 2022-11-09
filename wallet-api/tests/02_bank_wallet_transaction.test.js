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

// Test all deposit endpoints
describe('Test for all deposit endpoints', function testdeposit() {
  this.beforeAll(async function createUser() {
    // Create a user object
    this.user1 = new User('first', 'last', 'userx', 'emailx', 'phonex', 'password', null, 20000);

    // Save a user in database
    await db.post('users', this.user1);

    // Login the user
    const options = {
      url: 'http://127.0.0.1:5000/api/v1/login',
      json: true,
      body: {
        username: 'userx',
        password: 'password',
      },
    };
    const loginUser = utils.promisify(request.post);
    const response = await loginUser(options);
    const { token } = response.body.success;

    // Define post options
    this.getOptions = {
      url: 'http://127.0.0.1:5000/api/v1/deposits',
      json: true,
      headers: {
        authorization: token,
      },
    };

    this.postOptions = {
      url: 'http://127.0.0.1:5000/api/v1/deposit',
      json: true,
      headers: {
        authorization: token,
      },
    };
  });

  // Test to deposit money using correct credentials
  it('1. Test to deposit money using correct credentials', function depositWithData(done) {
    this.postOptions.body = {
      amount: 3000,
      method: 'Card',
      serviceProvider: 'Flutterwave',
    };
    request.post(this.postOptions, (err, res) => {
      expect(res.statusCode).to.be.equal(200);
      db.get('users', { username: 'userx' })
        .then((user) => {
          const { balance } = user.data[0];
          expect(balance).to.be.equal(20200);
          done();
        });
      done();
    });
  });

  // Test to deposit money using without amount
  it('2. Test to deposit money using without amount', function depositWithoutAmount(done) {
    this.postOptions.body = {
      method: 'Card',
      serviceProvider: 'Flutterwave',
    };
    request.post(this.postOptions, (err, res) => {
      expect(res.statusCode).to.be.equal(400);
      done();
    });
  });

  // Test to deposit money without method
  it('3. Test to deposit money without method', function depositWithoutMethod(done) {
    this.postOptions.body = {
      amount: 3000,
      serviceProvider: 'Flutterwave',
    };
    request.post(this.postOptions, (err, res) => {
      expect(res.statusCode).to.be.equal(400);
      done();
    });
  });

  // Test to deposit money without serviceProvider
  it('4. Test to deposit money without serviceProvider', function depositWithoutSP(done) {
    this.postOptions.body = {
      amount: 3000,
      method: 'Card',
    };
    request.post(this.postOptions, (err, res) => {
      expect(res.statusCode).to.be.equal(400);
      done();
    });
  });

  // Test to get all deposits with correct credentials
  it('5. Test to get all deposits with correct credentials', function getdepositsWithData(done) {
    request.get(this.getOptions, (err, res) => {
      expect(res.statusCode).to.be.equal(200);
      done();
    });
  });

  // Test to get all deposits with no credentials
  it('6. Test to get all deposits with no credentials', function getdepositsWithData(done) {
    this.getOptions.headers.authorization = 'none';
    request.get(this.getOptions, (err, res) => {
      expect(res.statusCode).to.be.equal(403);
      done();
    });
  });

  // Delete user from database
  this.afterAll(async function deleteUser() {
    // Delete all created users
    await db.del('users', { username: 'userx' });
  });
});

// Test all withdrawal endpoints
describe('Test for all withdrawal endpoints', function testwithdraw() {
  this.beforeAll(async function createUser() {
    // Create a user object
    this.user1 = new User('first', 'last', 'userx', 'emailx', 'phonex', 'password', null, 20000);

    // Save a user in database
    await db.post('users', this.user1);

    // Login the user
    const options = {
      url: 'http://127.0.0.1:5000/api/v1/login',
      json: true,
      body: {
        username: 'userx',
        password: 'password',
      },
    };
    const loginUser = utils.promisify(request.post);
    const response = await loginUser(options);
    const { token } = response.body.success;

    // Define post options
    this.getOptions = {
      url: 'http://127.0.0.1:5000/api/v1/withdrawals',
      json: true,
      headers: {
        authorization: token,
      },
    };

    this.postOptions = {
      url: 'http://127.0.0.1:5000/api/v1/withdraw',
      json: true,
      headers: {
        authorization: token,
      },
    };
  });

  // Test to withdraw money using correct credentials
  it('1. Test to withdraw money using correct credentials', function withdrawWithData(done) {
    this.postOptions.body = {
      amount: 7000,
      method: 'Card',
      serviceProvider: 'Flutterwave',
    };
    request.post(this.postOptions, (err, res) => {
      expect(res.statusCode).to.be.equal(200);
      db.get('users', { username: 'userx' })
        .then((user) => {
          const { balance } = user.data[0];
          expect(balance).to.be.equal(13000);
          done();
        });
    });
  });

  // Test to withdraw more than available funds
  it('2. Test to withdraw more than available funds', function withDrawMoreThanBalance(done) {
    this.postOptions.body = {
      amount: 70000,
      method: 'Card',
      serviceProvider: 'Flutterwave',
    };
    request.post(this.postOptions, (err, res) => {
      expect(res.statusCode).to.be.equal(400);
      done();
    });
  });

  // Test to withdraw money using without amount
  it('3. Test to withdraw money using without amount', function withdrawWithoutAmount(done) {
    this.postOptions.body = {
      method: 'Card',
      serviceProvider: 'Flutterwave',
    };
    request.post(this.postOptions, (err, res) => {
      expect(res.statusCode).to.be.equal(400);
      done();
    });
  });

  // Test to withdraw money without method
  it('4. Test to withdraw money without method', function withdrawWithoutMethod(done) {
    this.postOptions.body = {
      amount: 3000,
      serviceProvider: 'Flutterwave',
    };
    request.post(this.postOptions, (err, res) => {
      expect(res.statusCode).to.be.equal(400);
      done();
    });
  });

  // Test to withdraw money without serviceProvider
  it('5. Test to withdraw money without serviceProvider', function withdrawWithoutSP(done) {
    this.postOptions.body = {
      amount: 3000,
      method: 'Card',
    };
    request.post(this.postOptions, (err, res) => {
      expect(res.statusCode).to.be.equal(400);
      done();
    });
  });

  // Test to get all withdrawals with correct credentials
  it('6. Test to get all withdrawals with correct credentials', function getwithdrawalsWithData(done) {
    request.get(this.getOptions, (err, res) => {
      expect(res.statusCode).to.be.equal(200);
      done();
    });
  });

  // Test to get all withdrawals with wrong credentials
  it('7. Test to get all withdrawals with wrong credentials', function getwithdrawalsWithoutData(done) {
    this.getOptions.headers.authorization = 'none';
    request.get(this.getOptions, (err, res) => {
      expect(res.statusCode).to.be.equal(403);
      done();
    });
  });

  // Delete user from database
  this.afterAll(async function deleteUser() {
    // Delete all created users
    await db.del('users', { username: 'userx' });
  });
});
