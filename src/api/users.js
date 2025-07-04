// src/api/users.js

// Fetch all users from localStorage
export function getUsers() {
  const users = JSON.parse(localStorage.getItem("school_users") || "[]");
  
  // Initialize with sample users if none exist
  if (users.length === 0) {
    const sampleUsers = [
      {
        id: 1,
        username: "admin",
        password: "admin",
        role: "admin",
        parentId: null,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        username: "teacher",
        password: "teacher",
        role: "teacher",
        parentId: null,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        username: "student",
        password: "student",
        role: "student",
        parentId: null,
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        username: "parent",
        password: "parent",
        role: "parent",
        parentId: null,
        createdAt: new Date().toISOString()
      }
    ];
    
    localStorage.setItem("school_users", JSON.stringify(sampleUsers));
    return sampleUsers;
  }
  
  return users;
}

// Create/add a new user
export function createUser(user) {
  const users = getUsers();
  const newUser = {
    ...user,
    id: user.id || Date.now(),
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  localStorage.setItem("school_users", JSON.stringify(users));
  return newUser;
}

// Update user information
export function updateUser(userId, updates) {
  const users = getUsers();
  const updatedUsers = users.map(user => 
    user.id === userId ? { ...user, ...updates, updatedAt: new Date().toISOString() } : user
  );
  localStorage.setItem("school_users", JSON.stringify(updatedUsers));
  return updatedUsers.find(user => user.id === userId);
}

// Delete a user
export function deleteUser(userId) {
  const users = getUsers();
  const updatedUsers = users.filter(user => user.id !== userId);
  localStorage.setItem("school_users", JSON.stringify(updatedUsers));
  return updatedUsers;
}

// Get user by ID
export function getUserById(userId) {
  const users = getUsers();
  return users.find(user => user.id === userId);
}

// Get users by role
export function getUsersByRole(role) {
  const users = getUsers();
  return users.filter(user => user.role === role);
}

// Set current session (logged-in user)
export function setSession(user) {
  localStorage.setItem("school_session", JSON.stringify(user));
}

// Get current session (logged-in user)
export function getSession() {
  const session = localStorage.getItem("school_session");
  return session ? JSON.parse(session) : null;
}

// Clear session on logout
export function clearSession() {
  localStorage.removeItem("school_session");
}

// Check if user is authenticated
export function isAuthenticated() {
  return !!getSession();
}

// Check if user has specific role
export function hasRole(role) {
  const user = getSession();
  return user && user.role === role;
}

// Check if user can perform action based on role
export function canPerformAction(action) {
  const user = getSession();
  if (!user) return false;
  
  const permissions = {
    admin: ['create_post', 'delete_any_post', 'manage_users', 'view_all'],
    teacher: ['create_post', 'delete_own_post', 'view_all'],
    student: ['view_all', 'comment'],
    parent: ['view_all', 'comment']
  };
  
  return permissions[user.role]?.includes(action) || false;
}

