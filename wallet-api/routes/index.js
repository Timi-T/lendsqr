// This script handles routing of requests to endpoints

const express = require('express');

const router = express.Router();
const auth = require('../controllers/authController');

// Importing all required controllers for the endpoints
const UserController = require('../controllers/userController');
const AuthController = require('../controllers/authController');
const TransactionController = require('../controllers/transactionController');

// Linking request routes to controller methods
router.get('/api/v1/users', auth.verifyToken, UserController.allUsers);
router.get('/api/v1/user', auth.verifyToken, UserController.getUser);
router.get('/api/v1/deposits', auth.verifyToken, TransactionController.allDeposits);
router.get('/api/v1/transfers', auth.verifyToken, TransactionController.allTransfers);
router.get('/api/v1/withdrawals', auth.verifyToken, TransactionController.allWithdrawals);
router.get('/api/v1/transactions', auth.verifyToken, TransactionController.allTransactions);
router.post('/api/v1/signup', UserController.createUSer);
router.post('/api/v1/login', AuthController.login);
router.post('/api/v1/deposit', auth.verifyToken, TransactionController.deposit);
router.post('/api/v1/withdraw', auth.verifyToken, TransactionController.withdraw);
router.post('/api/v1/transfer', auth.verifyToken, TransactionController.transfer);

// Exporting the router instance
module.exports = router;
