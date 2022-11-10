/* eslint import/no-extraneous-dependencies: "off" */

// Data model for transfer object

const uuid = require('uuid');

// Class to implement a transfer object
class Transfer {
  constructor(
    sourceUsername,
    destinationUsername,
    sourceUserId,
    destinationUserId,
    amount,
    description,
    referenceNumber,
    balanceBefore,
    balanceAfter,
  ) {
    this.transfer_id = uuid.v4();
    this.source_username = sourceUsername;
    this.destination_username = destinationUsername;
    this.source_user_id = sourceUserId;
    this.destination_user_id = destinationUserId;
    this.amount = amount;
    this.description = description;
    this.reference_number = referenceNumber;
    this.balance_before = balanceBefore;
    this.balance_after = balanceAfter;
  }
}

module.exports = Transfer;
