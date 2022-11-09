## Getting started with the Demo Credit API
The Demo Credit API is a simple API that implements a simple wallet functionality which allows users to;

1. create an account
2. fund their account
3. transfer funds to another user’s account
4. withdraw funds from their account.

### General

> Linting style: ``eslint Airbnb base``

<p>To check scripts, run</p>

```
cd wallet-api && ./eslint.sh
```

> Testing

To test the endpoints run command

```
npm test
```

Test results
<img src="https://github.com/Timi-T/lendsqr/blob/master/images/tests.png" alt="Test results">

> Database structure

<img src="https://github.com/Timi-T/lendsqr/blob/master/images/database.png" alt="Database diagram">

### Setting up
The following steps will guide you to setup this API locally.

** Requirements **

1. Clone or fork this repository to get started
2. Have NodeJS LTS version installed on your machine.
3. Have MySQL installed on your machine.
4. run npm i --prefix wallet-api to install all dependencies.

### Step 1 - Preparing the database

<p>Due to suthorization issues with mysql, a separate user has to be created with the old hashing algorithm. I have put together a simple bash script for this purpose.</p>

From the root of this repository, run the script ``setup-db.sh`` and pass the user as a command line argument like so

```
./setup-db.sh [ USER ]
```

> Example: "./setup-db.sh root"

> If you intend to change the databse username or password, be sure to also correct the values in you environment variables or the ``wallet-api/db/knex.js`` file

### Step 2 - Make database migrations and populate with data

To make the database migrations, navigate to the ``wallet-api/db`` directory and run the following commands.

```
knex migrate:latest #To setup the schema for your database
knex seed:run #To populate the database with dummy data.
```

### Step 3 - Start the Node server

To start the node server run command

```npm run start-server```

Now you can access the API via localhost port 5000, using prefix ``api/v1``
> Example: http://127.0.0.1:5000/api/v1/login

### Api Documentation
> (Api documentation)[https://github.com/Timi-T/lendsqr/wallet-api]