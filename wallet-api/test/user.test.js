// This is a script to test all user related endpoints

const { expect } = require('chai');
const { describe } = require('mocha');
const request = require('request');
const sinon = require('sinon');
const db = require('../db/db');
const User = require('../dataObjects/userObject');

// Test /signup endpoint
describe('Test /signup endpoint', function testSignup() {
  this.beforeAll(async function createUser() {
    // Create user objects
    this.user1 = new User('first1', 'last1', 'user1', 'email1', 'phone1', 'password');
    this.user2 = new User('first2', 'last2', 'user2', 'email2', 'phone2', 'password');
    this.user3 = new User();
    this.user4 = new User('first4', 'last4', null, 'email4', 'phone4', 'password');
    this.user5 = new User('first5', 'last5', 'user5', null, 'phone5', 'password');
    this.user6 = new User('first6', 'last6', 'user6', 'email6', null, 'password');
    this.user7 = new User('first7', 'last7', 'user2', 'email7', 'phone7', 'password');
    this.user8 = new User('first8', 'last8', 'user8', 'email2', 'phone8', 'password');
    this.user9 = new User('first9', 'last9', 'user9', 'email9', 'phone2', 'password');

    // Save a user in database
    await db.post('users', this.user1);

    // Define post options
    this.options = {
      url: 'http://127.0.0.1:5000/api/v1/signup',
      json: true,
    }
  });

  // Test signup functionality with required data
  it('Test user signup with required data', function testWithCompleteData(done) {
    this.options.body = this.user2;
    const response = request.post(this.options, (err, res, data) => {
      expect(res.statusCode).to.be.equal(200);
      done();
    });
  });

  // Test signup functionality with missing data
  it('Test user signup with missing data', function testWithMissingData(done) {
    // Test without username
    this.options.body = this.user4;
    const response1 = request.post(this.options, (err, res, data) => {
      expect(res.statusCode).to.be.equal(400);
      // Test without email
      this.options.body = this.user5;
      const response2 = request.post(this.options, (err, res, data) => {
        expect(res.statusCode).to.be.equal(400);
        // Test without phone number
        this.options.body = this.user6;
        const response3 = request.post(this.options, (err, res, data) => {
          expect(res.statusCode).to.be.equal(400);
          done();
        });
      });
    });
  });

  // Test signup functionality with existing data
  it('Test user signup with existing data', function testWithMissingData(done) {
    // Test with existing username
    this.options.body = this.user7;
    const response1 = request.post(this.options, (err, res, data) => {
      expect(res.statusCode).to.be.equal(400);
      // Test with existing email
      this.options.body = this.user8;
      const response2 = request.post(this.options, (err, res, data) => {
        expect(res.statusCode).to.be.equal(400);
        // Test with existing phone number
        this.options.body = this.user9;
        const response = request.post(this.options, (err, res, data) => {
          expect(res.statusCode).to.be.equal(400);
          done();
        });
      });
    });
  });

  // Delete user from database 
  this.afterAll(async function deleteUser() {
    // Delete all created users
    await db.del('users', { username: 'user1' });
    await db.del('users', { username: 'user2' });
    await db.del('users', { username: 'user3' });
    await db.del('users', { username: 'user4' });
    await db.del('users', { username: 'user5' });
    await db.del('users', { username: 'user6' });
    await db.del('users', { username: 'user7' });
    await db.del('users', { username: 'user8' });
    await db.del('users', { username: 'user9' });
  });
});

// Test / login endpoint
describe('Test /login endpoint', function testLogin() {
  this.beforeAll(async function loginUser() {
    // Create a user object
    this.user1 = new User('first1', 'last1', 'user1', 'email1', 'phone1', 'password');
    this.credential1 = { username: 'user1', password: 'password' };
    this.credential2 = { username: 'userx', password: 'password' };
    this.credential3 = { username: 'user1', password: 'passwordx' };
    this.credential4 = { username: null, password: 'password' };
    this.credential5 = { username: 'user1', password: null };

    // Save a user in database
    await db.post('users', this.user1);

    // Define post options
    this.options = {
      url: 'http://127.0.0.1:5000/api/v1/login',
      json: true,
    }
  });

  // Test login functionality with correct data
  it('Test user login with correct data', function testWithCorrectData(done) {
    // Test user login with correct data
    this.options.body = this.credential1;
    const response1 = request.post(this.options, (err, res, data) => {
      expect(res.statusCode).to.be.equal(200);
      done();
    });
  });

  // Test login functionality with Incorrect data
  it('Test user login with Incorrect data', function testWithCorrectData(done) {
    // Test user login with Incorrect username/email
    this.options.body = this.credential2;
    const response1 = request.post(this.options, (err, res, data) => {
      expect(res.statusCode).to.be.equal(400);
      // Test user login with Incorrect password
      this.options.body = this.credential3;
      const response2 = request.post(this.options, (err, res, data) => {
          expect(res.statusCode).to.be.equal(401);
          done();
      });
    });
  });

  // Test login functionality with missing data
  it('Test user login with missing data', function testWithCorrectData(done) {
    // Test user login with missing username/email
    this.options.body = this.credential4;
    const response1 = request.post(this.options, (err, res, data) => {
      expect(res.statusCode).to.be.equal(401);
      // Test user login with missing password
      this.options.body = this.credential5;
      const response2 = request.post(this.options, (err, res, data) => {
        expect(res.statusCode).to.be.equal(400);
        done();
      });
    });
  });

  // Delete user from database 
  this.afterAll(async function deleteUser() {
    // Delete all created users
    await db.del('users', { username: 'user1' });
  });
});
