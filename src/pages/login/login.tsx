import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotPassword from './forgotPassword';
import { useAppDispatch } from '../../hooks/redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import useNotificationSystem from '../../components/notificationPopup';
import type { CurrentUser } from '../../store/slices/authSlice';

// Define user roles and permissions
export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface PredefinedUser {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
  createdAt: string;
}

// Predefined users with different roles
export const predefinedUsers: PredefinedUser[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@company.com',
    password: 'admin123',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'admin',
    permissions: ['Admin', 'Read', 'Write'],
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    username: 'john.doe',
    email: 'john.doe@company.com',
    password: 'user123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    permissions: ['Read'],
    createdAt: '2024-01-15'
  },
  {
    id: 3,
    username: 'jane.smith',
    email: 'jane.smith@company.com',
    password: 'user123',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'user',
    permissions: ['Read', 'Write'],
    createdAt: '2024-01-16'
  },
  {
    id: 4,
    username: 'mike.wilson',
    email: 'mike.wilson@company.com',
    password: 'user123',
    firstName: 'Mike',
    lastName: 'Wilson',
    role: 'user',
    permissions: ['Read'],
    createdAt: '2024-01-20'
  },
  {
    id: 5,
    username: 'sarah.johnson',
    email: 'sarah.johnson@company.com',
    password: 'admin123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'admin',
    permissions: ['Admin', 'Read', 'Write'],
    createdAt: '2024-01-25'
  }
];

// Available roles
export const userRoles: UserRole[] = [
  {
    id: 'admin',
    name: 'Administrator',
    permissions: ['Admin', 'Read', 'Write']
  },
  {
    id: 'user',
    name: 'User',
    permissions: ['Read']
  }
];

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    notifications,
    NotificationContainer,
    showSuccess,
    showError,
    removeNotification
  } = useNotificationSystem();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (isSignUp && !formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (isSignUp && formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (isSignUp) {
        // Handle sign up
        showSuccess('Account Created!', 'Your account has been created successfully. Welcome aboard!');
      } else {
        // Dispatch login start action
        dispatch(loginStart());
        
        // Handle login - validate against predefined users
        const user = predefinedUsers.find(
          u => u.username === formData.username && u.password === formData.password
        );
        
        if (user) {
          showSuccess('Login Successful!', `Welcome back, ${user.firstName}! You have been logged in successfully.`);
          
          // Create user object for Redux state
          const currentUser: CurrentUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role as 'admin' | 'user',
            permissions: user.permissions,
            avatar: null,
            createdAt: user.createdAt
          };

          // Store user data in localStorage for session management
          localStorage.setItem('currentUser', JSON.stringify(currentUser));

          // Dispatch login success action
          dispatch(loginSuccess(currentUser));

          // Route to dashboard after successful login
          setTimeout(() => {
            navigate('/dashboard'); // Navigate to dashboard
          }, 1500);
        } else {
          showError('Login Failed', 'Invalid username or password. Please try again.');
          dispatch(loginFailure('Invalid username or password'));
        }
      }
    } else {
      // Show error notification for validation failures
      showError('Validation Error', 'Please fix the errors in the form and try again.');
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  // Show forgot password component if requested
  if (showForgotPassword) {
    return <ForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base px-2">
            {isSignUp 
              ? 'Join us and start your journey today' 
              : 'Sign in to continue to your account'
            }
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-semibold text-gray-700 block text-left">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border-2 transition-all duration-200 bg-gray-50/50 focus:bg-white focus:outline-none text-sm sm:text-base ${
                    errors.username 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                  placeholder="Enter your username"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              {errors.username && <p className="text-red-500 text-xs sm:text-sm">{errors.username}</p>}
            </div>

            {/* Email Field (only for sign up) */}
            {isSignUp && (
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700 block text-left">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border-2 transition-all duration-200 bg-gray-50/50 focus:bg-white focus:outline-none text-sm sm:text-base ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-blue-500'
                    }`}
                    placeholder="Enter your email"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
                {errors.email && <p className="text-red-500 text-xs sm:text-sm">{errors.email}</p>}
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700 block text-left">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border-2 transition-all duration-200 bg-gray-50/50 focus:bg-white focus:outline-none text-sm sm:text-base ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs sm:text-sm">{errors.password}</p>}
            </div>

            {/* Confirm Password Field (only for sign up) */}
            {isSignUp && (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 block text-left">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border-2 transition-all duration-200 bg-gray-50/50 focus:bg-white focus:outline-none text-sm sm:text-base ${
                      errors.confirmPassword 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-blue-500'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs sm:text-sm">{errors.confirmPassword}</p>}
              </div>
            )}

            {/* Forgot Password Link (only for login) */}
            {!isSignUp && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button onClick={handleSubmit}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 sm:py-3 sm:px-4 rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:scale-[1.02] text-sm sm:text-base"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-gray-600 text-sm sm:text-base">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={toggleMode}
                className="ml-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors text-sm sm:text-base"
              >
                {isSignUp ? 'Sign In' : 'Create New Account'}
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          {!isSignUp && (
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-blue-700 font-medium">Admin:</span>
                  <span className="text-blue-600">admin / admin123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 font-medium">User:</span>
                  <span className="text-blue-600">john.doe / user123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 font-medium">User:</span>
                  <span className="text-blue-600">jane.smith / user123</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notification Container */}
      <NotificationContainer 
        notifications={notifications} 
        onClose={removeNotification} 
      />
    </div>
  );
};

export default Login;