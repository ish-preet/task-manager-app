# Quick Start Guide

Get TaskFlow up and running in 5 minutes!

## Step 1: Install Node.js and MongoDB

### Node.js
- Download from: https://nodejs.org/
- Recommended: LTS version (v18 or higher)
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### MongoDB
- **macOS**: 
  ```bash
  brew install mongodb-community
  brew services start mongodb-community
  ```

- **Ubuntu/Debian**:
  ```bash
  sudo apt-get install mongodb
  sudo systemctl start mongodb
  ```

- **Windows**:
  - Download from: https://www.mongodb.com/try/download/community
  - Install and run MongoDB as a service

- Verify MongoDB is running:
  ```bash
  mongo --version
  ```

## Step 2: Set Up the Project

1. Navigate to the project directory:
   ```bash
   cd task-manager-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. (Optional) Edit `.env` if needed:
   - Change `PORT` if 3000 is already in use
   - Update `MONGODB_URI` if using a different database
   - Set a strong `JWT_SECRET` for production

## Step 3: Run the Application

Start the server:
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

You should see:
```
MongoDB connected successfully
Server running on port 3000
```

## Step 4: Access the Application

Open your browser and go to:
```
http://localhost:3000
```

## Step 5: Create Your First Account

1. Click "Create one" on the login page
2. Fill in your details:
   - Username: Choose a unique username
   - Email: Your email address
   - Password: At least 6 characters
3. Click "Create Account"
4. You're in! Start creating tasks.

---

## Common Issues & Solutions

### Port Already in Use
**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**: 
- Change the PORT in `.env` file to another port (e.g., 3001)
- Or kill the process using port 3000:
  ```bash
  # macOS/Linux
  lsof -ti:3000 | xargs kill -9
  
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

### MongoDB Connection Failed
**Error**: `MongoServerError: connect ECONNREFUSED`

**Solution**:
- Make sure MongoDB is running:
  ```bash
  # Check if MongoDB is running
  # macOS
  brew services list
  
  # Linux
  sudo systemctl status mongodb
  
  # Start MongoDB if not running
  # macOS
  brew services start mongodb-community
  
  # Linux
  sudo systemctl start mongodb
  ```

### Module Not Found
**Error**: `Error: Cannot find module 'express'`

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Authentication Errors
**Issue**: Can't log in after registration

**Solution**:
- Clear browser localStorage:
  - Open browser DevTools (F12)
  - Go to Application tab
  - Clear Local Storage
  - Refresh the page

---

## Testing the API

Use these curl commands to test the API:

### Register a user:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create a task (replace YOUR_TOKEN):
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "My first task",
    "description": "This is a test task",
    "priority": "high",
    "status": "pending"
  }'
```

---

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API reference
- Customize the styling in `public/css/style.css`
- Add your own features!

---

## Need Help?

- Check the logs in your terminal for error messages
- Make sure all prerequisites are installed correctly
- Verify MongoDB is running and accessible
- Check that port 3000 (or your custom port) is available

Happy task managing! 🎯
