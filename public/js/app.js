// Configuration
const API_URL = 'http://localhost:3000/api';
let authToken = localStorage.getItem('authToken');
let currentUser = null;
let currentFilter = { status: 'all', priority: 'all' };
let editingTaskId = null;

// DOM Elements
const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');
const loginForm = document.getElementById('login');
const registerForm = document.getElementById('register');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const loginFormContainer = document.getElementById('loginForm');
const registerFormContainer = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');
const userGreeting = document.getElementById('userGreeting');
const tasksContainer = document.getElementById('tasksContainer');
const newTaskBtn = document.getElementById('newTaskBtn');
const taskModal = document.getElementById('taskModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const taskForm = document.getElementById('taskForm');
const searchInput = document.getElementById('searchInput');
const notification = document.getElementById('notification');
const viewTitle = document.getElementById('viewTitle');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    if (authToken) {
        checkAuth();
    } else {
        showAuth();
    }
    
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Auth form switching
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.style.display = 'none';
        registerFormContainer.style.display = 'block';
    });
    
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';
    });
    
    // Forms
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    taskForm.addEventListener('submit', handleTaskSubmit);
    
    // Buttons
    logoutBtn.addEventListener('click', handleLogout);
    newTaskBtn.addEventListener('click', () => openTaskModal());
    closeModal.addEventListener('click', closeTaskModal);
    cancelBtn.addEventListener('click', closeTaskModal);
    
    // Search
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter.status = e.target.dataset.status;
            viewTitle.textContent = e.target.textContent;
            loadTasks();
        });
    });
    
    document.querySelectorAll('.priority-filter').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.priority-filter').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter.priority = e.target.dataset.priority;
            loadTasks();
        });
    });
    
    // Close modal on outside click
    taskModal.addEventListener('click', (e) => {
        if (e.target === taskModal) {
            closeTaskModal();
        }
    });
}

// Authentication
async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            authToken = result.token;
            localStorage.setItem('authToken', authToken);
            currentUser = result.user;
            showApp();
            showNotification('Welcome back!', 'success');
        } else {
            showNotification(result.error || 'Login failed', 'error');
        }
    } catch (error) {
        showNotification('Network error. Please try again.', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName')
    };
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            authToken = result.token;
            localStorage.setItem('authToken', authToken);
            currentUser = result.user;
            showApp();
            showNotification('Account created successfully!', 'success');
        } else {
            const errorMsg = result.error || result.errors?.[0]?.msg || 'Registration failed';
            showNotification(errorMsg, 'error');
        }
    } catch (error) {
        showNotification('Network error. Please try again.', 'error');
    }
}

async function checkAuth() {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            const result = await response.json();
            currentUser = result.user;
            showApp();
        } else {
            handleLogout();
        }
    } catch (error) {
        handleLogout();
    }
}

function handleLogout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    showAuth();
}

// UI State Management
function showAuth() {
    authSection.style.display = 'flex';
    appSection.style.display = 'none';
    loginForm.reset();
    registerForm.reset();
}

function showApp() {
    authSection.style.display = 'none';
    appSection.style.display = 'block';
    
    const greeting = currentUser.firstName 
        ? `Hello, ${currentUser.firstName}!` 
        : `Hello, ${currentUser.username}!`;
    userGreeting.textContent = greeting;
    
    loadTasks();
    loadStats();
}

// Tasks Management
async function loadTasks() {
    const params = new URLSearchParams();
    
    if (currentFilter.status !== 'all') {
        params.append('status', currentFilter.status);
    }
    if (currentFilter.priority !== 'all') {
        params.append('priority', currentFilter.priority);
    }
    
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        params.append('search', searchTerm);
    }
    
    try {
        const response = await fetch(`${API_URL}/tasks?${params.toString()}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            const result = await response.json();
            displayTasks(result.tasks);
        } else {
            showNotification('Failed to load tasks', 'error');
        }
    } catch (error) {
        showNotification('Network error', 'error');
    }
}

function displayTasks(tasks) {
    if (tasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="empty-state">
                <h3>No tasks found</h3>
                <p>Create your first task to get started</p>
            </div>
        `;
        return;
    }
    
    tasksContainer.innerHTML = tasks.map(task => `
        <div class="task-card" data-task-id="${task._id}">
            <div class="task-header">
                <div>
                    <div class="task-title">${escapeHtml(task.title)}</div>
                    ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
                </div>
                <div class="task-actions">
                    <button class="icon-btn edit-btn" data-task-id="${task._id}">Edit</button>
                    <button class="icon-btn delete delete-btn" data-task-id="${task._id}">Delete</button>
                </div>
            </div>
            <div class="task-meta">
                <span class="badge badge-status ${task.status}">${formatStatus(task.status)}</span>
                <span class="badge badge-priority ${task.priority}">${formatPriority(task.priority)}</span>
                ${task.dueDate ? `<span class="task-date">Due: ${formatDate(task.dueDate)}</span>` : ''}
            </div>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const taskId = e.target.dataset.taskId;
            const task = tasks.find(t => t._id === taskId);
            openTaskModal(task);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const taskId = e.target.dataset.taskId;
            deleteTask(taskId);
        });
    });
}

async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/tasks/stats/summary`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            const result = await response.json();
            updateStats(result);
        }
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

function updateStats(stats) {
    let total = 0;
    let completed = 0;
    
    stats.statusBreakdown.forEach(item => {
        total += item.count;
        if (item._id === 'completed') {
            completed = item.count;
        }
    });
    
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
}

// Task Modal
function openTaskModal(task = null) {
    editingTaskId = task ? task._id : null;
    
    if (task) {
        document.getElementById('modalTitle').textContent = 'Edit Task';
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskStatus').value = task.status;
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskDueDate').value = task.dueDate ? task.dueDate.split('T')[0] : '';
    } else {
        document.getElementById('modalTitle').textContent = 'New Task';
        taskForm.reset();
    }
    
    taskModal.classList.add('active');
}

function closeTaskModal() {
    taskModal.classList.remove('active');
    taskForm.reset();
    editingTaskId = null;
}

async function handleTaskSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        title: formData.get('title'),
        description: formData.get('description'),
        status: formData.get('status'),
        priority: formData.get('priority'),
        dueDate: formData.get('dueDate') || undefined
    };
    
    try {
        const url = editingTaskId 
            ? `${API_URL}/tasks/${editingTaskId}` 
            : `${API_URL}/tasks`;
        const method = editingTaskId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            closeTaskModal();
            loadTasks();
            loadStats();
            showNotification(
                editingTaskId ? 'Task updated!' : 'Task created!',
                'success'
            );
        } else {
            const errorMsg = result.error || result.errors?.[0]?.msg || 'Failed to save task';
            showNotification(errorMsg, 'error');
        }
    } catch (error) {
        showNotification('Network error', 'error');
    }
}

async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            loadTasks();
            loadStats();
            showNotification('Task deleted', 'success');
        } else {
            showNotification('Failed to delete task', 'error');
        }
    } catch (error) {
        showNotification('Network error', 'error');
    }
}

// Utility Functions
function handleSearch() {
    loadTasks();
}

function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function formatStatus(status) {
    return status.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function formatPriority(priority) {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
