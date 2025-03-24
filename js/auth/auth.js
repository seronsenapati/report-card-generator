/**
 * Authentication and Security Module
 * Provides role-based access control (admin, teacher, student)
 */

// User roles and permissions
const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  GUEST: 'guest'
};

// Permission levels for different actions
const PERMISSIONS = {
  CREATE_REPORT: ['admin', 'teacher'],
  EDIT_REPORT: ['admin', 'teacher'],
  VIEW_REPORT: ['admin', 'teacher', 'student'],
  BULK_IMPORT: ['admin', 'teacher'],
  MANAGE_USERS: ['admin'],
  SHARE_REPORT: ['admin', 'teacher'],
  VIEW_CHARTS: ['admin', 'teacher', 'student'],
  CHANGE_TEMPLATE: ['admin', 'teacher']
};

// User store (in a real app, this would be in a database)
let users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123', // In a real app, this would be hashed
    role: ROLES.ADMIN,
    name: 'Administrator',
    email: 'admin@school.edu'
  },
  {
    id: 2,
    username: 'teacher',
    password: 'teacher123',
    role: ROLES.TEACHER,
    name: 'John Smith',
    email: 'john.smith@school.edu'
  },
  {
    id: 3,
    username: 'student',
    password: 'student123',
    role: ROLES.STUDENT,
    name: 'Jane Doe',
    email: 'jane.doe@school.edu',
    rollNo: '12345',
    class: 'X',
    section: 'A'
  }
];

// Current user session
let currentUser = null;
let isAuthenticated = false;

// Initialize authentication system
function initAuth() {
  // Create auth UI
  createAuthUI();
  
  // Check if user is already logged in (from localStorage)
  checkExistingSession();
  
  // Add event listeners
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('logout-button').addEventListener('click', handleLogout);
  document.getElementById('register-link').addEventListener('click', showRegistrationForm);
  document.getElementById('register-form').addEventListener('submit', handleRegistration);
  document.getElementById('login-link').addEventListener('click', showLoginForm);
  
  // Update UI based on authentication state
  updateAuthUI();
}

// Create authentication UI
function createAuthUI() {
  // Create auth container
  const authContainer = document.createElement('div');
  authContainer.id = 'auth-container';
  authContainer.className = 'auth-container';
  authContainer.innerHTML = `
    <div id="login-modal" class="auth-modal">
      <div class="auth-modal-content">
        <div class="auth-tabs">
          <button id="login-tab" class="auth-tab active">Login</button>
          <button id="register-tab" class="auth-tab">Register</button>
        </div>
        
        <form id="login-form" class="auth-form">
          <h3>Login to Report Card Generator</h3>
          <div class="form-group">
            <label for="login-username">Username</label>
            <input type="text" id="login-username" required>
          </div>
          <div class="form-group">
            <label for="login-password">Password</label>
            <input type="password" id="login-password" required>
          </div>
          <div class="form-group">
            <button type="submit" class="auth-button">Login</button>
          </div>
          <div class="form-group text-center">
            <a href="#" id="register-link">Don't have an account? Register</a>
          </div>
          <div id="login-error" class="auth-error"></div>
        </form>
        
        <form id="register-form" class="auth-form" style="display: none;">
          <h3>Create an Account</h3>
          <div class="form-group">
            <label for="register-name">Full Name</label>
            <input type="text" id="register-name" required>
          </div>
          <div class="form-group">
            <label for="register-email">Email</label>
            <input type="email" id="register-email" required>
          </div>
          <div class="form-group">
            <label for="register-username">Username</label>
            <input type="text" id="register-username" required>
          </div>
          <div class="form-group">
            <label for="register-password">Password</label>
            <input type="password" id="register-password" required>
          </div>
          <div class="form-group">
            <label for="register-role">Role</label>
            <select id="register-role">
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <div id="student-fields" class="additional-fields">
            <div class="form-group">
              <label for="register-roll">Roll Number</label>
              <input type="text" id="register-roll">
            </div>
            <div class="form-group">
              <label for="register-class">Class</label>
              <select id="register-class">
                <option value="I">Class 1</option>
                <option value="II">Class 2</option>
                <option value="III">Class 3</option>
                <option value="IV">Class 4</option>
                <option value="V">Class 5</option>
                <option value="VI">Class 6</option>
                <option value="VII">Class 7</option>
                <option value="VIII">Class 8</option>
                <option value="IX">Class 9</option>
                <option value="X">Class 10</option>
                <option value="XI">Class 11</option>
                <option value="XII">Class 12</option>
              </select>
            </div>
            <div class="form-group">
              <label for="register-section">Section</label>
              <input type="text" id="register-section">
            </div>
          </div>
          <div class="form-group">
            <button type="submit" class="auth-button">Register</button>
          </div>
          <div class="form-group text-center">
            <a href="#" id="login-link">Already have an account? Login</a>
          </div>
          <div id="register-error" class="auth-error"></div>
        </form>
      </div>
    </div>
    
    <div id="user-info" class="user-info" style="display: none;">
      <span id="user-name"></span>
      <span id="user-role"></span>
      <button id="logout-button">Logout</button>
    </div>
  `;
  
  // Add the auth container to the body
  document.body.appendChild(authContainer);
  
  // Add CSS for auth
  const authStyle = document.createElement('style');
  authStyle.textContent = `
    .auth-container {
      position: fixed;
      top: 0;
      right: 0;
      padding: 10px;
      z-index: 1000;
    }
    
    .auth-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      z-index: 1001;
      justify-content: center;
      align-items: center;
    }
    
    .auth-modal-content {
      background-color: white;
      width: 90%;
      max-width: 400px;
      border-radius: 8px;
      overflow: hidden;
      padding: 20px;
    }
    
    .auth-tabs {
      display: flex;
      margin-bottom: 20px;
    }
    
    .auth-tab {
      flex: 1;
      padding: 10px;
      border: none;
      background: #f1f1f1;
      cursor: pointer;
    }
    
    .auth-tab.active {
      background: #069A8E;
      color: white;
    }
    
    .auth-form {
      display: flex;
      flex-direction: column;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    
    .form-group input, .form-group select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .auth-button {
      background-color: #069A8E;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    
    .auth-button:hover {
      background-color: #057c72;
    }
    
    .auth-error {
      color: red;
      margin-top: 10px;
    }
    
    .text-center {
      text-align: center;
    }
    
    .user-info {
      background-color: #069A8E;
      color: white;
      padding: 8px 15px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    #user-role {
      background-color: rgba(255, 255, 255, 0.2);
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 0.8em;
    }
    
    #logout-button {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      border: none;
      padding: 3px 8px;
      border-radius: 3px;
      cursor: pointer;
    }
    
    .additional-fields {
      border-top: 1px solid #eee;
      padding-top: 10px;
      margin-top: 10px;
    }
    
    /* Hide the main content until logged in */
    .auth-required {
      display: none;
    }
  `;
  
  document.head.appendChild(authStyle);
  
  // Add tab switching functionality
  document.getElementById('login-tab').addEventListener('click', function() {
    this.classList.add('active');
    document.getElementById('register-tab').classList.remove('active');
    document.getElementById('login-form').style.display = 'flex';
    document.getElementById('register-form').style.display = 'none';
  });
  
  document.getElementById('register-tab').addEventListener('click', function() {
    this.classList.add('active');
    document.getElementById('login-tab').classList.remove('active');
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'flex';
  });
  
  // Add role change handler for registration form
  document.getElementById('register-role').addEventListener('change', function() {
    const studentFields = document.getElementById('student-fields');
    if (this.value === 'student') {
      studentFields.style.display = 'block';
    } else {
      studentFields.style.display = 'none';
    }
  });
}

// Check for existing session
function checkExistingSession() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      isAuthenticated = true;
      showMainContent(); // Show main content if user is authenticated
    } catch (e) {
      console.error('Error parsing saved user:', e);
      localStorage.removeItem('currentUser');
      showLoginForm(); // Show login form if there's an error
    }
  } else {
    // No saved user, show login form
    showLoginForm();
  }
}

// Show login form
function showLoginForm() {
  document.getElementById('login-modal').style.display = 'flex';
  document.getElementById('login-tab').click();
}

// Show registration form
function showRegistrationForm() {
  document.getElementById('login-modal').style.display = 'flex';
  document.getElementById('register-tab').click();
}

// Handle login form submission
function handleLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  
  // Find user
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    // Login successful
    currentUser = { ...user };
    delete currentUser.password; // Don't store password in memory
    
    isAuthenticated = true;
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update UI
    updateAuthUI();
    
    // Close modal
    document.getElementById('login-modal').style.display = 'none';
    
    // Apply permissions
    applyPermissions();
    
    // Show main content
    showMainContent();
  } else {
    // Login failed
    document.getElementById('login-error').textContent = 'Invalid username or password';
  }
}

// Handle logout
function handleLogout() {
  currentUser = null;
  isAuthenticated = false;
  
  // Remove from localStorage
  localStorage.removeItem('currentUser');
  
  // Update UI
  updateAuthUI();
  
  // Apply permissions
  applyPermissions();
  
  // Hide main content
  hideMainContent();
}

// Handle registration form submission
function handleRegistration(event) {
  event.preventDefault();
  
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  const role = document.getElementById('register-role').value;
  
  // Check if username already exists
  if (users.some(u => u.username === username)) {
    document.getElementById('register-error').textContent = 'Username already exists';
    return;
  }
  
  // Create new user
  const newUser = {
    id: users.length + 1,
    username,
    password,
    role,
    name,
    email
  };
  
  // Add student-specific fields if role is student
  if (role === 'student') {
    newUser.rollNo = document.getElementById('register-roll').value;
    newUser.class = document.getElementById('register-class').value;
    newUser.section = document.getElementById('register-section').value;
  }
  
  // Add user to users array
  users.push(newUser);
  
  // Auto-login the new user
  currentUser = { ...newUser };
  delete currentUser.password; // Don't store password in memory
  
  isAuthenticated = true;
  
  // Save to localStorage
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  
  // Update UI
  updateAuthUI();
  
  // Close modal
  document.getElementById('login-modal').style.display = 'none';
  
  // Apply permissions
  applyPermissions();
  
  // Show main content
  showMainContent();
}

// Update authentication UI based on current state
function updateAuthUI() {
  const loginModal = document.getElementById('login-modal');
  const userInfo = document.getElementById('user-info');
  
  if (isAuthenticated && currentUser) {
    // User is logged in
    loginModal.style.display = 'none';
    userInfo.style.display = 'flex';
    
    // Update user info
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-role').textContent = currentUser.role;
    
    // Show main content
    showMainContent();
    
    // If student, pre-fill form with their info
    if (currentUser.role === ROLES.STUDENT) {
      document.querySelector('.i-name').value = currentUser.name;
      document.querySelector('.i-roll').value = currentUser.rollNo || '';
      document.querySelector('.i-class').value = currentUser.class || 'I';
      document.querySelector('.i-sec').value = currentUser.section || '';
    }
  } else {
    // User is not logged in
    userInfo.style.display = 'none';
    loginModal.style.display = 'flex';
    
    // Hide main content
    hideMainContent();
  }
}

// Apply permissions based on user role
function applyPermissions() {
  // Default to guest permissions if not authenticated
  const role = isAuthenticated ? currentUser.role : ROLES.GUEST;
  
  // Hide/show elements based on permissions
  applyPermissionToElement('#std_input_table', PERMISSIONS.CREATE_REPORT, role);
  applyPermissionToElement('#show-charts', PERMISSIONS.VIEW_CHARTS, role);
  applyPermissionToElement('#bulk-processing', PERMISSIONS.BULK_IMPORT, role);
  applyPermissionToElement('#template-selector', PERMISSIONS.CHANGE_TEMPLATE, role);
  applyPermissionToElement('#layout-selector', PERMISSIONS.CHANGE_TEMPLATE, role);
  
  // If student, only show their own report
  if (role === ROLES.STUDENT) {
    // Disable editing for students
    const inputs = document.querySelectorAll('#std_input_table input, #std_input_table select');
    inputs.forEach(input => {
      input.readOnly = true;
      if (input.tagName === 'SELECT') {
        input.disabled = true;
      }
    });
    
    // Enable the submit button for viewing
    document.querySelector('input[onclick="send_data_for_print()"]').disabled = false;
  }
}

// Apply permission to a specific element
function applyPermissionToElement(selector, allowedRoles, userRole) {
  const element = document.querySelector(selector);
  if (!element) return;
  
  if (allowedRoles.includes(userRole)) {
    element.style.display = '';
  } else {
    element.style.display = 'none';
  }
}

// Check if user has permission for a specific action
function hasPermission(action) {
  if (!isAuthenticated) return false;
  return PERMISSIONS[action].includes(currentUser.role);
}

// Get current user
function getCurrentUser() {
  return currentUser;
}

// Check if user is authenticated
function isUserAuthenticated() {
  return isAuthenticated;
}

// Hide the main content
function hideMainContent() {
  // Add auth-required class to main content container
  const mainContent = document.querySelector('.container');
  if (mainContent) {
    mainContent.classList.add('auth-required');
  }
}

// Show the main content
function showMainContent() {
  // Remove auth-required class from main content container
  const mainContent = document.querySelector('.container');
  if (mainContent) {
    mainContent.classList.remove('auth-required');
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth);
