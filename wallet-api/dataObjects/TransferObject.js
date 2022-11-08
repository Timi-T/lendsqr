/* eslint import/no-extraneous-dependencies: "off" */

// Data model for transfer object

const uuid = require('uuid');

// Class to implement a transfer object
class Transfer {
  constructor(
    sourceUsername,
    destUsername,
    amount,
    description,
    refNumber,
    balanceBefore,
    balanceAfter,
  ) {
    this.transferId = uuid.v4();
    this.sourceUsername = sourceUsername;
    this.destUsername = destUsername;
    this.amount = amount;
    this.description = description;
    this.referenceNumber = refNumber;
    this.balanceBefore = balanceBefore;
    this.balanceAfter = balanceAfter;
  }
}

module.exports = Transfer;
