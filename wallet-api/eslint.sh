#!/bin/bash

#============================================#
echo "LINTING CHECK FOR scripts"
echo "#============================================#"

echo "Running eslint on files in main directory"
echo " "
echo "Checking server.js file"
echo " "
npx eslint server.js
echo " "
echo "Done checking main directory"
echo " "
echo "#============================================#"
echo " "
echo "Running eslint on files in controller directory..."
echo " "
echo "Checking controllers/userController.js file"
npx eslint controllers/userController.js
echo "Checking controllers/transactionController.js file"
npx eslint controllers/transactionController.js
echo "Checking controllers/authController.js file"
npx eslint controllers/authController.js
echo " "
echo "Done checking contoller directory"
echo " "
echo "#============================================#"
echo " "
echo "Running eslint on files in dataObjects directory..."
echo " "
echo "Checking dataObjects/TransferObject.js file"
npx eslint dataObjects/TransferObject.js
echo "Checking dataObjects/userObject.js"
npx eslint dataObjects/userObject.js
echo "Checking dataObjects/bankWalletTransactionObject.js file"
npx eslint dataObjects/bankWalletTransactionObject.js
echo " "
echo "Done checking dataObjects directory"
echo " "
echo "#============================================#"
echo " "
echo "Running eslint on files in db directory..."
echo " "
echo "Checking db/db.js file"
npx eslint db/db.js
echo "Checking db/knexfile.js file"
npx eslint db/knexfile.js
echo "Checking db/migrations/20221103182013_create_tables.js file"
npx eslint db/migrations/20221103182013_create_tables.js
echo "Checking db/seeds/01_users_table.js file"
npx eslint db/seeds/01_users_table.js
echo "Checking db/seeds/02_bank_wallet_table.js file"
npx eslint db/seeds/02_bank_wallet_table.js
echo "Checking db/seeds/03_transfers_table.js file"
npx eslint db/seeds/03_transfers_table.js
echo "Done checking db directory"
echo " "
echo "#============================================#"
echo " "
echo "Running eslint on files in routes directory..."
echo " "
echo "Checking routes/index.js"
npx eslint routes/index.js
echo "Done checking routes directory"
echo " "
echo "#============================================#"
#============================================#
