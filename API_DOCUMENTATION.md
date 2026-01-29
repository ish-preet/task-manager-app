# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### Authentication Endpoints

#### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "65abc123...",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### Login User
**POST** `/auth/login`

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "user": {
    "_id": "65abc123...",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### Get Current User
**GET** `/auth/me`

Get the authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "user": {
    "_id": "65abc123...",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Task Endpoints

#### Get All Tasks
**GET** `/tasks`

Retrieve all tasks for the authenticated user with optional filtering and pagination.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (`pending`, `in-progress`, `completed`, `cancelled`)
- `priority` (optional): Filter by priority (`low`, `medium`, `high`, `urgent`)
- `search` (optional): Search in title and description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Example Request:**
```
GET /tasks?status=pending&priority=high&page=1&limit=10
```

**Response:** `200 OK`
```json
{
  "tasks": [
    {
      "_id": "65def456...",
      "title": "Complete project documentation",
      "description": "Write comprehensive API docs",
      "status": "pending",
      "priority": "high",
      "dueDate": "2024-01-20T00:00:00.000Z",
      "userId": "65abc123...",
      "tags": ["documentation", "api"],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

#### Get Single Task
**GET** `/tasks/:id`

Retrieve a specific task by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "task": {
    "_id": "65def456...",
    "title": "Complete project documentation",
    "description": "Write comprehensive API docs",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-01-20T00:00:00.000Z",
    "userId": "65abc123...",
    "tags": ["documentation", "api"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

#### Create Task
**POST** `/tasks`

Create a new task.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API docs",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-01-20",
  "tags": ["documentation", "api"]
}
```

**Response:** `201 Created`
```json
{
  "message": "Task created successfully",
  "task": {
    "_id": "65def456...",
    "title": "Complete project documentation",
    "description": "Write comprehensive API docs",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-01-20T00:00:00.000Z",
    "userId": "65abc123...",
    "tags": ["documentation", "api"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

#### Update Task
**PUT** `/tasks/:id`

Update an existing task.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "completed",
  "description": "Updated description"
}
```

**Response:** `200 OK`
```json
{
  "message": "Task updated successfully",
  "task": {
    "_id": "65def456...",
    "title": "Complete project documentation",
    "description": "Updated description",
    "status": "completed",
    "priority": "high",
    "completedAt": "2024-01-16T14:20:00.000Z",
    "updatedAt": "2024-01-16T14:20:00.000Z"
  }
}
```

---

#### Delete Task
**DELETE** `/tasks/:id`

Delete a task.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "message": "Task deleted successfully"
}
```

---

#### Get Task Statistics
**GET** `/tasks/stats/summary`

Get statistics about your tasks.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "statusBreakdown": [
    { "_id": "pending", "count": 10 },
    { "_id": "in-progress", "count": 5 },
    { "_id": "completed", "count": 15 }
  ],
  "priorityBreakdown": [
    { "_id": "low", "count": 8 },
    { "_id": "medium", "count": 12 },
    { "_id": "high", "count": 7 },
    { "_id": "urgent", "count": 3 }
  ]
}
```

---

### User Endpoints

#### Update Profile
**PUT** `/users/profile`

Update user profile information.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "username": "johnsmith"
}
```

**Response:** `200 OK`
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "65abc123...",
    "username": "johnsmith",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Smith"
  }
}
```

---

#### Change Password
**PUT** `/users/password`

Change user password.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password updated successfully"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid input data",
  "errors": [
    {
      "msg": "Email is required",
      "param": "email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "No authentication token provided"
}
```

### 404 Not Found
```json
{
  "error": "Task not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Something went wrong"
}
```

---

## Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required or failed
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Data Models

### User Model
```javascript
{
  username: String (3-30 chars, unique),
  email: String (unique, validated),
  password: String (hashed, min 6 chars),
  firstName: String (optional, max 50 chars),
  lastName: String (optional, max 50 chars),
  createdAt: Date,
  lastLogin: Date
}
```

### Task Model
```javascript
{
  title: String (required, max 200 chars),
  description: String (optional, max 1000 chars),
  status: Enum ['pending', 'in-progress', 'completed', 'cancelled'],
  priority: Enum ['low', 'medium', 'high', 'urgent'],
  dueDate: Date (optional),
  userId: ObjectId (reference to User),
  tags: Array of Strings,
  completedAt: Date (auto-set when status is 'completed'),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Rate Limiting

Currently no rate limiting is implemented, but it's recommended to add it for production use.

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.
