# TaskFlow - Task Management System

A full-stack task management application built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Task Management**: Full CRUD operations for tasks
- **Filtering & Search**: Filter tasks by status, priority, and search functionality
- **Statistics Dashboard**: Track your task completion and productivity
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **RESTful API**: Well-structured backend API with proper validation

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Express Validator for input validation

### Frontend
- HTML5
- CSS3 (Custom styling, no frameworks)
- Vanilla JavaScript (ES6+)
- Fetch API for HTTP requests

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. **Clone the repository** or extract the project files

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
```

4. **Start MongoDB**

Make sure MongoDB is running on your system:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
net start MongoDB
```

5. **Run the application**

Development mode with auto-restart:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

6. **Access the application**

Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
task-manager-app/
├── models/
│   ├── User.js          # User model schema
│   └── Task.js          # Task model schema
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── tasks.js         # Task management routes
│   └── users.js         # User profile routes
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── public/
│   ├── index.html       # Main HTML file
│   ├── css/
│   │   └── style.css    # Application styles
│   └── js/
│       └── app.js       # Frontend JavaScript
├── server.js            # Express server setup
├── package.json         # Dependencies and scripts
└── .env.example         # Environment variables template
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Tasks
- `GET /api/tasks` - Get all tasks (with filtering and pagination)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats/summary` - Get task statistics

### Users
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password

## Usage Guide

### Creating an Account
1. Click "Create one" on the login page
2. Fill in your details (username, email, password)
3. Click "Create Account"

### Managing Tasks
1. Click "+ New Task" to create a task
2. Fill in the task details:
   - Title (required)
   - Description (optional)
   - Status (pending, in-progress, completed, cancelled)
   - Priority (low, medium, high, urgent)
   - Due date (optional)
3. Click "Save Task"

### Filtering Tasks
- Use the sidebar filters to view tasks by status or priority
- Use the search bar to find specific tasks
- Click on any filter to activate it

### Editing/Deleting Tasks
- Click "Edit" on any task card to modify it
- Click "Delete" to remove a task (with confirmation)

## Development

### Running Tests
```bash
npm test
```

### Code Style
The project follows standard JavaScript conventions:
- Use camelCase for variables and functions
- Use PascalCase for classes and models
- Use semicolons
- 2-space indentation

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Helmet.js for HTTP headers security
- Rate limiting ready (can be added)

## Performance Optimizations

- Database indexing for faster queries
- Compression middleware
- Pagination for large datasets
- Debounced search input
- Efficient MongoDB queries

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check the connection string in `.env`
- Verify MongoDB port (default: 27017)

### Authentication Errors
- Clear localStorage and try logging in again
- Check if JWT_SECRET is set in `.env`
- Verify token hasn't expired (default: 7 days)

### Port Already in Use
- Change PORT in `.env` file
- Kill process using the port:
  ```bash
  # Find process
  lsof -ti:3000
  
  # Kill process
  kill -9 <PID>
  ```

## Future Enhancements

- Task categories/projects
- Task sharing and collaboration
- Email notifications
- File attachments
- Recurring tasks
- Task comments
- Dark mode
- Export tasks to CSV/PDF

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please create an issue in the repository or contact the development team.

## Acknowledgments

- Built with modern web technologies
- Designed for simplicity and ease of use
- Focused on user experience and performance
