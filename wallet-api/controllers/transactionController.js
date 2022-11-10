/* eslint class-methods-use-this: "off" */

// Controller for transactions endpoints

const db = require('../db/db');

// Importing relavant data models for transactions
const Transfer = require('../dataObjects/TransferObject');
const BankWalletTransaction = require('../dataObjects/bankWalletTransactionObject');

function generateRand(length) {
  const Id = [...Array(length)].map(() => {
    const num = String(Math.random() * 10)[0];
    return Number(num);
  }).join('');
  return Id;
}

// Transaction class with methods for making a transaction
class Transaction {
  // Method to deposit money from a bank account
  async deposit(req, res) {
    // Getting body of post request and declaring variables
    const { user } = req;
    const referenceNumber = generateRand(10);
    const userId = user.user_id;
    const type = 'deposit';
    const { amount } = req.body;
    const { method } = req.body;
    const { serviceProvider } = req.body;
    const { description } = req.body;
    const status = 'success';

    // Checking that all required credentials are provided
    if (!amount) return res.status(400).send({ error: 'Please provide amount' });
    const msg = 'Amount has to be a figure';

    // Checking that amount is a Number
    try {
      Number(amount);
      if (typeof amount !== 'number') return res.status(400).send({ error: msg });
    } catch {
      return res.status(400).send({ error: msg });
    }

    // When method or service provider is missing
    if (!method) return res.status(400).send({ error: 'Please provide payment method' });
    if (!serviceProvider) return res.status(400).send({ error: 'Please provide a service provider' });

    // Getting the current balance for the user
    const userCurrent = await db.get('lend_users', { user_id: userId });
    const userBalance = userCurrent.data[0].balance;
    const balanceBefore = Number(userBalance);
    const balanceAfter = Number(amount) + userBalance;

    // Updating the balance for the user account
    const filters = { user_id: userId };
    const data = { balance: balanceAfter };
    await db.put('lend_users', filters, data);

    // Creating a record in the database for the transaction
    const newDeposit = new BankWalletTransaction(
      userId,
      method,
      type,
      serviceProvider,
      amount,
      description,
      referenceNumber,
      balanceBefore,
      balanceAfter,
      status,
    );

    // Create a record for the deposit in the database
    await db.post('bank_wallet_transactions', newDeposit);

    return res.send({ success: `Your wallet has been credited with ${amount}. Your balance is ${balanceAfter}.` });
  }

  // Method to withdraw money from a bank account
  async withdraw(req, res) {
    // Getting body of post request and declaring variables
    const { user } = req;
    const referenceNumber = generateRand(10);
    const userId = user.user_id;
    const type = 'withdrawal';
    const { amount } = req.body;
    const { method } = req.body;
    const { serviceProvider } = req.body;
    const { description } = req.body;
    const status = 'success';

    // Checking that all required credentials are provided
    if (!amount) return res.status(400).send({ error: 'Please provide amount' });
    const msg = 'Amount has to be a figure';

    // Checking that amount is a Number
    try {
      Number(amount);
      if (typeof amount !== 'number') return res.status(400).send({ error: msg });
    } catch {
      return res.status(400).send({ error: msg });
    }

    // When method or service provider is missing
    if (!method) return res.status(400).send({ error: 'Please provide payment method' });
    if (!serviceProvider) return res.status(400).send({ error: 'Please provide a service provider' });

    // Getting the current balance for the user
    const userCurrent = await db.get('lend_users', { user_id: userId });
    const userBalance = userCurrent.data[0].balance;
    const balanceBefore = userBalance;
    const balanceAfter = userBalance - amount;

    // Checking if source account has enough funds
    if (balanceAfter < 0) return res.status(400).send({ error: 'Insufficient funds' });

    // Updating the balance for the user account
    const filters = { user_id: userId };
    const data = { balance: balanceAfter };
    await db.put('lend_users', filters, data);

    // Creating a record in the database for the transaction
    const newWithdrawal = new BankWalletTransaction(
      userId,
      method,
      type,
      serviceProvider,
      amount * -1,
      description,
      referenceNumber,
      balanceBefore,
      balanceAfter,
      status,
    );

    // Creating a record for the withdrawal in the database
    await db.post('bank_wallet_transactions', newWithdrawal);

    return res.send({ success: `Your wallet has been debited with ${amount}. Your balance is ${balanceAfter}.` });
  }

  async transfer(req, res) {
    // Getting body of post request and declaring variables
    const { user } = req;
    const userId = user.user_id;
    const sourceUsername = user.username;
    const referenceNumber = generateRand(10);
    const { destinationUsername } = req.body;
    const { amount } = req.body;
    const { description } = req.body;

    // Checking that all required credentials are provided
    if (!amount) return res.status(400).send({ error: 'Please provide amount' });
    const msg = 'Amount has to be a figure';

    // Checking that amount is a Number
    try {
      Number(amount);
      if (typeof amount !== 'number') return res.status(400).send({ error: msg });
    } catch {
      return res.status(400).send({ error: msg });
    }

    // When there is no destination to transfer to
    if (!destinationUsername) return res.status(400).send({ error: 'Please provide a username to make a transfer to.' });

    // Getting the current balance for the user
    const userCurrent = await db.get('lend_users', { user_id: userId });
    const userBalance = userCurrent.data[0].balance;
    const balanceBefore = userBalance;
    const balanceAfter = userBalance - amount;

    // Checking if provided username exists
    const destUserData = await db.get('lend_users', { username: destinationUsername });
    if (destUserData.data.length === 0) return res.status(400).send({ error: 'Invalid username' });

    // Checking if source account has enough funds
    if (balanceAfter < 0) return res.status(400).send({ error: 'Insufficient funds' });

    // Crediting the destination account
    const destUser = destUserData.data[0];
    const destFilters = { user_id: destUser.user_id };
    const destData = { balance: amount + destUser.balance };
    await db.put('lend_users', destFilters, destData);

    // Debiting source account
    const sourceFilters = { user_id: user.user_id };
    const sourceData = { balance: balanceAfter };
    await db.put('lend_users', sourceFilters, sourceData);

    // Creating a record in the database for the transaction
    const newTransfer = new Transfer(
      sourceUsername,
      destinationUsername,
      user.user_id,
      destUser.user_id,
      amount,
      description,
      referenceNumber,
      balanceBefore,
      balanceAfter,
    );

    // Creating a record for he transfer in the database
    await db.post('transfers', newTransfer);

    return res.send({ success: `Transfer to ${destinationUsername} successful!. Your balance is ${balanceAfter}.` });
  }

  // Method to retrieve all deposits for a user
  async allDeposits(req, res) {
    // Getting page from the request parameters
    let { page } = req.query;

    // Checking that amount is a Number
    try {
      page = Number(page);
      if (!page) { page = 1; }
    } catch {
      page = 1;
    }

    // Getting the current user
    const { user } = req;

    // Getting all deposits for the user from the database
    const deposits = await db.get('bank_wallet_transactions', { transaction_user_id: user.user_id, type: 'deposit' }, page, 10);

    // Sort according to date
    deposits.data.sort((a, b) => b.created_at - a.created_at);

    // Increment the page number and check if we are on last page
    let nextPage = page + 1;
    if (!deposits.pagination.lastPage || deposits.pagination.lastPage === page) {
      nextPage = null;
    }

    return res.status(200).send(
      {
        _links: {
          self: { href: `/deposits?page=${page}` },
          next: { href: `/deposits?page=${nextPage}` },
        },
        results: deposits.data,
      },
    );
  }

  // Method to retrieve all withdrawals for a user
  async allWithdrawals(req, res) {
    // Getting page from the request parameters
    let { page } = req.query;

    // Checking that amount is a Number
    try {
      page = Number(page);
      if (!page) { page = 1; }
    } catch {
      page = 1;
    }

    // Getting the current user
    const { user } = req;

    // Getting all withdrawals for the user from the database
    const withdrawals = await db.get('bank_wallet_transactions', { transaction_user_id: user.user_id, type: 'withdrawal' }, page, 10);

    // Sort according to date
    withdrawals.data.sort((a, b) => b.created_at - a.created_at);

    // Increment the page number and check if we are on last page
    let nextPage = page + 1;
    if (!withdrawals.pagination.lastPage || withdrawals.pagination.lastPage === page) {
      nextPage = null;
    }

    return res.send(
      {
        _links: {
          self: { href: `/withdrawals?page=${page}` },
          next: { href: `/withdrawals?page=${nextPage}` },
        },
        results: withdrawals.data,
      },
    );
  }

  // Method to retrieve all transfers for a user
  async allTransfers(req, res) {
    // Getting page from the request parameters
    let { page } = req.query;

    // Checking that amount is a Number
    try {
      page = Number(page);
      if (!page) { page = 1; }
    } catch {
      page = 1;
    }

    // Getting the current user
    const { user } = req;

    // Getting all transfers done by the user from the database
    const transfers = await db.get('transfers', { source_user_id: user.user_id }, page, 10);

    // Sort according to date
    transfers.data.sort((a, b) => b.created_at - a.created_at);

    // Increment the page number and check if we are on last page
    let nextPage = page + 1;
    if (!transfers.pagination.lastPage || transfers.pagination.lastPage === page) {
      nextPage = null;
    }

    return res.send(
      {
        _links: {
          self: { href: `/transfers?page=${page}` },
          next: { href: `/transfers?page=${nextPage}` },
        },
        results: transfers.data,
      },
    );
  }

  // Method to retrieve all transactions for a user
  async allTransactions(req, res) {
    // Getting page from the request parameters
    let { page } = req.query;

    // Checking that amount is a Number
    try {
      page = Number(page);
      if (!page) { page = 1; }
    } catch {
      page = 1;
    }

    // Getting the current user
    const { user } = req;

    // Getting all transactions done by the user from the database
    const deposits = await db.get('bank_wallet_transactions', { transaction_user_id: user.user_id, type: 'deposit' }, page, 5);
    const withdrawals = await db.get('bank_wallet_transactions', { transaction_user_id: user.user_id, type: 'withdrawal' }, page, 5);
    const transfers = await db.get('transfers', { source_user_id: user.user_id }, page, 5);
    const transactions = [...deposits.data, ...withdrawals.data, ...transfers.data];

    // Sort according to date
    transactions.sort((a, b) => b.created_at - a.created_at);

    // Increment the page number and check if we are on last page
    let nextPage = page + 1;
    const dp = deposits.pagination.lastPage;
    const wp = withdrawals.pagination.lastPage;
    const tp = transfers.pagination.lastPage;
    if ((!dp || dp === page) && (!wp || wp === page) && (!tp || tp === page)) {
      nextPage = null;
    }

    return res.send(
      {
        _links: {
          self: { href: `/transactions?page=${page}` },
          next: { href: `/transactions?page=${nextPage}` },
        },
        results: transactions,
      },
    );
  }
}

// Export an instance of the class
module.exports = new Transaction();
