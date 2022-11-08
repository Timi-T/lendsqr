/* eslint class-methods-use-this: "off" */

// Controller for transactions endpoints

const db = require('../db/db');

// Importing relavant data models for transactions
const Transfer = require('../dataObjects/TransferObject');
const BankWalletTransaction = require('../dataObjects/bankWalletTransactionObject');

// Transaction class with methods for making a transaction
class Transaction {
  // Method to deposit money from a bank account
  async deposit(req, res) {
    // Getting body of post request and declaring variables
    const { user } = req;
    const referenceNumber = `ref-${[...Array(10)].map(() => {
      const num = String(Math.random() * 10)[0];
      return Number(num);
    }).join('')}`;
    const { userId } = user;
    const type = 'deposit';
    const { amount } = req.body;
    const { method } = req.body;
    const { serviceProvider } = req.body;
    const { description } = req.body;
    const status = 'success';

    // Checking that all required credentials are provided
    if (!amount) return res.status(400).send({ error: 'Please provide amount' });
    const msg = 'Amount has to be a figure';
    try {
      amount = Number(amount);
      if (typeof amount != 'number') return res.status(400).send({ error: msg });
    } catch {
      return res.status(400).send({ error: msg });
    }
    if (!method) return res.status(400).send({ error: 'Please provide payment method' });
    if (!serviceProvider) return res.status(400).send({ error: 'Please provide a service provider' });

    // Getting the current balance for the user
    const userCurrent = await db.get('users', { userId });
    const userBalance = userCurrent.data[0].balance;
    const balanceBefore = userBalance;
    const balanceAfter = amount + userBalance;

    // Updating the balance for the user account
    const filters = { userId };
    const data = { balance: balanceAfter };
    await db.put('users', filters, data);

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

    await db.post('bank_wallet_transactions', newDeposit);
    return res.send({ success: `Your wallet has been credited with ${amount}. Your balance is ${balanceAfter}.` });
  }

  // Method to withdraw money from a bank account
  async withdraw(req, res) {
    // Getting body of post request and declaring variables
    const { user } = req;
    const referenceNumber = `ref-${[...Array(10)].map(() => {
      const num = String(Math.random() * 10)[0];
      return Number(num);
    }).join('')}`;
    const { userId } = user;
    const type = 'withdrawal';
    const { amount } = req.body;
    const { method } = req.body;
    const { serviceProvider } = req.body;
    const { description } = req.body;
    const status = 'success';

    // Checking that all required credentials are provided
    if (!amount) return res.status(400).send({ error: 'Please provide amount' });
    const msg = 'Amount has to be a figure';
    try {
      Number(amount);
      if (typeof amount != 'number') return res.status(400).send({ error: msg });
    } catch {
      return res.status(400).send({ error: msg });
    }
    if (!method) return res.status(400).send({ error: 'Please provide payment method' });
    if (!serviceProvider) return res.status(400).send({ error: 'Please provide a service provider' });

    // Getting the current balance for the user
    const userCurrent = await db.get('users', { userId });
    const userBalance = userCurrent.data[0].balance;
    const balanceBefore = userBalance;
    const balanceAfter = userBalance - amount;

    // Checking if source account has enough funds
    if (balanceAfter < 0) return res.status(200).send({ error: 'Insufficient funds' });

    // Updating the balance for the user account
    const filters = { userId };
    const data = { balance: balanceAfter };
    await db.put('users', filters, data);

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

    await db.post('bank_wallet_transactions', newWithdrawal);
    return res.send({ success: `Your wallet has been debited with ${amount}. Your balance is ${balanceAfter}.` });
  }

  async transfer(req, res) {
    // Getting body of post request and declaring variables
    const { user } = req;
    const { userId } = user;
    const sourceUsername = user.username;
    const referenceNumber = `ref-${[...Array(10)].map(() => {
      const num = String(Math.random() * 10)[0];
      return Number(num);
    }).join('')}`;
    const { destinationUsername } = req.body;
    const { amount } = req.body;
    const { description } = req.body;

    // Checking that all required credentials are provided
    if (!amount) return res.status(400).send({ error: 'Please provide amount' });
    const msg = 'Amount has to be a figure';
    try {
      Number(amount);
      if (typeof amount != 'number') return res.status(400).send({ error: msg });
    } catch {
      return res.status(400).send({ error: msg });
    }
    if (!destinationUsername) return res.status(400).send({ error: 'Please provide a username to make a transfer to.' });

    // Getting the current balance for the user
    const userCurrent = await db.get('users', { userId });
    const userBalance = userCurrent.data[0].balance;
    const balanceBefore = userBalance;
    const balanceAfter = userBalance - amount;

    // Checking if provided username exists
    const destUserData = await db.get('users', { username: destinationUsername });
    if (destUserData.data.length === 0) return res.status(400).send({ error: 'Invalid username' });

    // Checking if source account has enough funds
    if (balanceAfter < 0) return res.status(200).send({ error: 'Insufficient funds' });

    // Crediting the destination account
    const destUser = destUserData.data[0];
    const destFilters = { userId: destUser.userId };
    const destData = { balance: amount + destUser.balance };
    await db.put('users', destFilters, destData);

    // Debiting source account
    const sourceFilters = { userId: user.userId };
    const sourceData = { balance: balanceAfter };
    await db.put('users', sourceFilters, sourceData);

    // Creating a record in the database for the transaction
    const newTransfer = new Transfer(
      sourceUsername,
      destinationUsername,
      amount,
      description,
      referenceNumber,
      balanceBefore,
      balanceAfter,
    );

    await db.post('transfers', newTransfer);
    return res.send({ success: `Transfer to ${destinationUsername} successful!. Your balance is ${balanceAfter}.` });
  }

  // Method to retrieve all deposits for a user
  async allDeposits(req, res) {
    let { page } = req.query;
    try {
      page = Number(page);
      if (!page) { page = 1; }
    } catch {
      page = 1;
    }
    const { user } = req;
    const deposits = await db.get('bank_wallet_transactions', { userId: user.userId, type: 'deposit' }, page, 10);
    deposits.data.sort((a, b) => b.createdAt - a.createdAt);
    let nextPage = page + 1;
    if (!deposits.pagination.lastPage || deposits.pagination.lastPage === page) {
      nextPage = null;
    }
    return res.send(
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
    let { page } = req.query;
    try {
      page = Number(page);
      if (!page) { page = 1; }
    } catch {
      page = 1;
    }
    const { user } = req;
    const withdrawals = await db.get('bank_wallet_transactions', { userId: user.userId, type: 'withdrawal' }, page, 10);
    withdrawals.data.sort((a, b) => b.createdAt - a.createdAt);
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
    let { page } = req.query;
    try {
      page = Number(page);
      if (!page) { page = 1; }
    } catch {
      page = 1;
    }
    const { user } = req;
    const transfers = await db.get('transfers', { sourceUsername: user.username }, page, 10);
    transfers.data.sort((a, b) => b.createdAt - a.createdAt);
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
    let { page } = req.query;
    try {
      page = Number(page);
      if (!page) { page = 1; }
    } catch {
      page = 1;
    }
    const { user } = req;
    const deposits = await db.get('bank_wallet_transactions', { userId: user.userId, type: 'deposit' }, page, 5);
    const withdrawals = await db.get('bank_wallet_transactions', { userId: user.userId, type: 'withdrawal' }, page, 5);
    const transfers = await db.get('transfers', { sourceUsername: user.username }, page, 5);
    const transactions = [...deposits.data, ...withdrawals.data, ...transfers.data];
    transactions.sort((a, b) => b.createdAt - a.createdAt);
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
