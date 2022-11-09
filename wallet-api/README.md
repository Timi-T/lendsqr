## API Documentation
```
Routes
POST '/api/v1/signup'
POST '/api/v1/login'
POST '/api/v1/deposit'
POST '/api/v1/withdraw'
POST '/api/v1/transfer'

GET '/api/v1/users?page=1'
GET '/api/v1/user?username=[anyUsername]&walletId=[anyWalletId]'
GET '/api/v1/deposits?page=1'
GET '/api/v1/transfers?page=1'
GET '/api/v1/withdrawals?page=1'
GET '/api/v1/transactions?page=1'
```

The API is protected with a simple token based system. So you need to first create an account then login to access other endpoints.

### SIGNUP - Create a user

> ``Method: POST``

> ``url: https://ogunbode-opeyemi-lendsqr-be-test.onrender.com/api/v1/signup``

Request Data:

```
{
	"firstname": "String", (Required)
	"lastname": "String",  (Required)
	"username": "String",  (Required, Unique)
	"email": "String",     (Required, Unique)
	"phone": "String",     (Required, Unique)
	"password": "String"   (Required)
}
```

Response Payload:

```
On success
{
    "success": "User [username] has been created"
}
```

### LOGIN - Get authorization for requests

> ``Method: POST``

> ``url: https://ogunbode-opeyemi-lendsqr-be-test.onrender.com/api/v1/login``

Request Data:

```
{
	"username": "YOUR USERNAME", (Required)
	"password": "YOUR PASSWORD"  (Required)
}
```

Response Payload:

```
On success
{
    "success": {
        "token": [ACCESS TOKEN]
    },
    "instruction": "Include the token in the ( Authorization ) header for your request."
}

With wrong email or username
{
    "error": "Wrong email or username"
}

With wrong password
{
    "error": "Wrong password"
}
```

For all other endpoints, include the provided token in your request headers.

#### Postman
<img src="https://github.com/Timi-T/lendsqr/blob/master/images/postman.png" alt="Include headers">

#### CURL
```
curl https://ogunbode-opeyemi-lendsqr-be-test.onrender.com/api/v1/users -H "authorization: ACCESS_TOKEN"
```

### DEPOSIT - Deposit money from bank into wallet

> ``Method: POST``

> ``url: https://ogunbode-opeyemi-lendsqr-be-test.onrender.com/api/v1/deposit``

Request Data:

```
{
	"amount": "Float",          (Required)
	"method": "String",         (Required)
	"serviceProvider": "String" (Required)
    "description": "String"     (Not required)
}
```

Response Payload:

```
On success
{
    "success": "Your wallet has been credited with [amount]. Your balance is [balance]."
}

With a non Float amount type
{
    "error": "Amount has to be a figure"
}
```

### WITHDRAW - Withdraw money from wallet to a bank account

> ``Method: POST``

> ``url: https://ogunbode-opeyemi-lendsqr-be-test.onrender.com/api/v1/withdraw``

Request Data:

```
{
	"amount": "Float",        (Required)
	"method": "String",         (Required)
	"serviceProvider": "String" (Required)
    "description": "String"     (Not required)
}
```

Response Payload:

```
On success
{
    "success": "Your wallet has been debited with [amount]. Your balance is [balance]."
}

With a non Float amount type
{
    "error": "Amount has to be a figure"
}
```

### TRANSFER - Transfer funds from one wallet to another

> ``Method: POST``

> ``url: https://ogunbode-opeyemi-lendsqr-be-test.onrender.com/api/v1/transfer``

Request Data:

```
{
	"amount": "Float",               (Required)
	"destinationUsername": "String", (Required)
	"description": "String",         (Not required)
}
```

Response Payload:

```
On success
{
    "success": "Transfer to [destinationUsername] successful!. Your balance is [balance]."
}

With a non Float amount type
{
    "error": "Amount has to be a figure"
}

With a non-existent walletName
{
    "error": "Invalid username"
}
```

### FIND USERS - Get all registered users

> ``Method: GET``

> ``url: https://ogunbode-opeyemi-lendsqr-be-test.onrender.com/api/v1/users?page=1``
> This endpoint uses pagination. When no page number is provided or page number is not an intger, it defaults to 1.

Request Data: ``None``

Response Payload:

```
On success
{
    "_links": {
        "self": {
            "href": "/users?page=1"
        },
        "next": {
            "href": "/users?page=2"
        }
    },
    "results": [
        {
            "userId": "String",
            "firstname": "String",
            "lastname": "String",
            "walletId": "Float"
        },
    ]
}
```

The current page and the next page is provided in the ``_links`` object.
> The next page becomes null at the end of the results

### FIND A USER - Get wallet Id and username for a user

> ``Method: GET``

> ``url: https://ogunbode-opeyemi-lendsqr-be-test.onrender.com/api/v1/user?username=[username]&walletId=[walletId]``

Request Data: ``None``

Response Payload:

```
On success
{
    "userId": "1",
    "username": "opeyemi1",
    "walletId": "12345678"
}

With invalid url parameter (username/walletId)
{
    "error": "User not found"
}

With no url parameter
{
    "error": "User not found. Include walletId or username as a request parameter"
}
```

### DEPOSITS - Find deposits for a user

> ``Method: GET``

> ``url: https://ogunbode-opeyemi-lendsqr-be-test.onrender.com/api/v1/deposits?page=1``

> This endpoint uses pagination. When no page number is provided or page number is not an intger, it defaults to 1.

Request Data: ``None``

Response Payload:

```
On success
{
    "_links": {
        "self": {
            "href": "/users?page=1"
        },
        "next": {
            "href": "/users?page=null"
        }
    },
    "results": [
        {
            "transactionId": "String",
            "type": "String",
            "method": "String",
            "serviceProvider": "String",
            "amount": "Float",
            "description": "String",
            "referenceNumber": "String",
            "status": "String",
            "balanceBefore": "Float",
            "balanceAfter": "Float",
            "createdAt": "Date string",
            "userId": "String"
        },
    ]
}
```

The current page and the next page is provided in the ``_links`` object.

> The next page becomes null at the end of the results

### WITHDRAWALS - Find withdrawals for a user

> ``Method: GET``

> ``url: https://ogunbode-opeyemi-lendsqr-be-test.onrender.com/api/v1/withdrawals?page=1``

> This endpoint uses pagination. When no page number is provided or page number is not an intger, it defaults to 1.

Request Data: ``None``

Response Payload:

```
On success
{
    "_links": {
        "self": {
            "href": "/users?page=1"
        },
        "next": {
            "href": "/users?page=null"
        }
    },
    "results": [
        {
            "transactionId": "String",
            "type": "String",
            "method": "String",
            "serviceProvider": "String",
            "amount": "Float",
            "description": "String",
            "referenceNumber": "String",
            "status": "String",
            "balanceBefore": "Float",
            "balanceAfter": "Float",
            "createdAt": "Date string",
            "userId": "String"
        },
    ]
}
```

The current page and the next page is provided in the ``_links`` object.

> The next page becomes null at the end of the results

### TRANSFERS - Get all transfers made by a user

> ``Method: GET`

> ``url: https://ogunbode-opeyemi-lendsqr-be-test.onrender.com/api/v1/tranfers?page=1``

> This endpoint uses pagination. When no page number is provided or page number is not an intger, it defaults to 1.

Request Data: ``None``

Response Payload:

```
On success
{
    "_links": {
        "self": {
            "href": "/users?page=1"
        },
        "next": {
            "href": "/users?page=null"
        }
    },
    "results": [
        {
            "transferId": "String",
            "amount": "Float,
            "sourceUsername": "String",
            "destUsername": "String",
            "description": "String",
            "referenceNumber": "String",
            "balanceBefore": "Float",
            "balanceAfter": "Float",
            "createdAt": "Date string",
            "destUserId": "String"
        },
    ]
}
```

The current page and the next page is provided in the ``_links`` object.

> The next page becomes null at the end of the results

### TRANSACTIONS - Get all transactions made by a user

> ``Method: GET``

> ``url: https://ogunbode-opeyemi-lendsqr-be-test.onrender.com/api/v1/transactions?page=1``

> This endpoint uses pagination. When no page number is provided or page number is not an intger, it defaults to 1.

> This endpoint returns a combination of transfers, deposits and withdrawals.

Request Data: ``None``

Response Payload:

```
On success
{
    "_links": {
        "self": {
            "href": "/users?page=1"
        },
        "next": {
            "href": "/users?page=null"
        }
    },
    "results": [
        {
            "transferId": "String",
            "amount": "Float,
            "sourceUsername": "String",
            "destUsername": "String",
            "description": "String",
            "referenceNumber": "String",
            "balanceBefore": "Float",
            "balanceAfter": "Float",
            "createdAt": "Date string",
            "destUserId": "String"
        },
        {
            "transactionId": "String",
            "type": "String",
            "method": "String",
            "serviceProvider": "String",
            "amount": "Float",
            "description": "String",
            "referenceNumber": "String",
            "status": "String",
            "balanceBefore": "Float",
            "balanceAfter": "Float",
            "createdAt": "Date string",
            "userId": "String"
        },
    ]
}
```

The current page and the next page is provided in the ``_links`` object.

> The next page becomes null at the end of the results
