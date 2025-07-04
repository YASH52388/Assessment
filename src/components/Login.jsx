import { useEffect, useState } from "react";
import { FiUser, FiLock, FiEye, FiEyeOff, FiUserPlus, FiLogIn, FiClock } from "react-icons/fi";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", role: "student" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");

  // Sample users stored in state (replacing localStorage)
  const [users, setUsers] = useState([
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
  ]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = users.find(
      u => u.username === form.username && u.password === form.password
    );

    if (user) {
      setCurrentUser(user);
    } else {
      setError("Invalid username or password");
    }
    setIsLoading(false);
  };

  const handleSignup = async () => {
    setIsLoading(true);
    setError("");
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (users.find(u => u.username === form.username)) {
      setError("Username already exists");
      setIsLoading(false);
      return;
    }

    const newUser = {
      ...form,
      id: Date.now(),
      parentId: null,
      createdAt: new Date().toISOString()
    };
    
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setIsLoading(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setForm({ username: "", password: "", role: "student" });
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'role-admin';
      case 'teacher': return 'role-teacher';
      case 'student': return 'role-student';
      case 'parent': return 'role-parent';
      default: return 'role-default';
    }
  };

  // If user is logged in, show dashboard
  if (currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FiUser className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to SMART</h1>
            <p className="text-gray-600">You are successfully logged in!</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {currentUser.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{currentUser.username}</h3>
            <span className={`role-badge ${getRoleBadgeClass(currentUser.role)}`}>
              {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
            </span>
            <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
              <FiClock className="w-4 h-4 mr-1" />
              Joined {new Date(currentUser.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-3 rounded-lg border">
                <div className="font-medium text-gray-900">Total Users</div>
                <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <div className="font-medium text-gray-900">Your Role</div>
                <div className="text-2xl font-bold text-green-600 capitalize">{currentUser.role}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="btn-secondary w-full"
            >
              <FiLogIn className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" 
         style={{
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
         }}>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white opacity-5 rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand section */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4 backdrop-blur-sm">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SMART</h1>
          <p className="text-white text-opacity-80">School Management System</p>
        </div>

        {/* Main form card */}
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 animate-slideInLeft">
          <div className="form-header">
            <h2 className="form-title">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="form-subtitle">
              {isSignup ? "Join our educational platform" : "Sign in to your account"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            {/* Username field */}
            <div className="form-field">
              <FiUser className="form-icon" />
              <input
                name="username"
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            {/* Password field */}
            <div className="form-field">
              <FiLock className="form-icon" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="form-input"
                style={{ paddingRight: '3rem' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <FiEyeOff className="w-5 h-5" />
                ) : (
                  <FiEye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Role selection for signup */}
            {isSignup && (
              <div className="form-field">
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="form-input appearance-none cursor-pointer"
                  style={{ paddingLeft: '1rem' }}
                  required
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                  <option value="parent">Parent</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="button"
              onClick={isSignup ? handleSignup : handleLogin}
              disabled={isLoading}
              className="form-button"
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  {isSignup ? <FiUserPlus className="w-4 h-4 mr-2" /> : <FiLogIn className="w-4 h-4 mr-2" />}
                  <span>{isSignup ? "Create Account" : "Sign In"}</span>
                </>
              )}
            </button>
          </div>

          {/* Toggle between login/signup */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError("");
                  setForm({ username: "", password: "", role: "student" });
                }}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
              >
                {isSignup ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>

          {/* Demo credentials */}
          {!isSignup && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-2 font-medium">Demo Credentials:</p>
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>Admin:</span>
                  <span>admin / admin</span>
                </div>
                <div className="flex justify-between">
                  <span>Teacher:</span>
                  <span>teacher / teacher</span>
                </div>
                <div className="flex justify-between">
                  <span>Student:</span>
                  <span>student / student</span>
                </div>
                <div className="flex justify-between">
                  <span>Parent:</span>
                  <span>parent / parent</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 animate-fadeIn">
          <p className="text-white text-opacity-70 text-sm">
            © 2024 SMART School Management System
          </p>
        </div>
      </div>
    </div>
  );
}