# Users API Documentation

Base path: `/api/users`

## Endpoints

### Ping

`GET /api/users/ping`

Health check endpoint to verify service availability.

**Response:**

- 200 OK: Returns "pong"

### Register User

`POST /api/users/register`

Register a new user in the system.

**Request Body:**

```typescript
{
  email: string; // User's email address
  password: string; // User's password
  name: string; // User's full name
}
```

**Responses:**

- 201 Created: Returns UserTokenDto
  ```typescript
  {
    userId: string; // Unique identifier for the user
    token: string; // Authentication token
  }
  ```
- 400 Bad Request: Invalid input data
- 409 Conflict: Email already in use

### Login

`POST /api/users/login`

Authenticate an existing user.

**Request Body:**

```typescript
{
  email: string; // User's email address
  password: string; // User's password
}
```

**Responses:**

- 200 OK: Returns UserTokenDto
  ```typescript
  {
    userId: string; // Unique identifier for the user
    token: string; // Authentication token
  }
  ```
- 400 Bad Request: Invalid input data
- 401 Unauthorized: Invalid credentials

### Delete User

`DELETE /api/users`

Delete the currently authenticated user.

**Headers Required:**

- x-api-key: API key for service authentication
- Authorization: Bearer token from login/register

**Responses:**

- 200 OK: User successfully deleted
- 401 Unauthorized: Invalid or missing authentication
- 404 Not Found: User does not exist

### Get User by ID

`GET /api/users/:id`

Retrieve user information by their ID.

**Headers Required:**

- x-api-key: API key for service authentication

**Parameters:**

- id (path): User's unique identifier

**Responses:**

- 200 OK: Returns UserDto
  ```typescript
  {
    id: string; // User's unique identifier
    email: string; // User's email address
    name: string; // User's full name
  }
  ```
- 404 Not Found: User does not exist

## Security

Most endpoints require authentication via:

1. API Key (x-api-key header)
2. User Token (Authorization: Bearer token header)

The only public endpoints are:

- POST /register
- POST /login
- GET /ping
