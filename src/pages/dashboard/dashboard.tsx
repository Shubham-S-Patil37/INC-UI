import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { selectUser, selectIsAdmin } from '../../store/selectors/authSelectors';
import { logout } from '../../store/slices/authSlice';
import useNotificationSystem from '../../components/notificationPopup';
import { 
  HiCamera, 
  HiUser, 
  HiCheckCircle, 
  HiClock, 
  HiCog, 
  HiUsers, 
  HiChartBar, 
  HiOfficeBuilding, 
  HiExclamationCircle,
  HiX,
  HiPlus,
  HiDownload,
  HiPencil,
  HiClipboardCheck,
  HiShieldCheck
} from 'react-icons/hi';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  image?: string;
  createdAt: string;
}
const Dashboard: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUser);
  const isAdminUser = useAppSelector(selectIsAdmin);

  // Profile form data state - moved to top level to avoid hook order issues
  const [profileFormData, setProfileFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    username: currentUser?.username || '',
    avatar: currentUser?.avatar || null as string | null,
    newImage: null as File | null
  });

  // Update profile form data when currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setProfileFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        username: currentUser.username || '',
        avatar: currentUser.avatar || null,
        newImage: null
      });
    }
  }, [currentUser]);

  // Profile form handlers
  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        showError('Invalid File Type', 'Please upload JPG or PNG images only.');
        return;
      }

      // Validate file size (5MB for profile images)
      if (file.size > 5 * 1024 * 1024) {
        showError('File Too Large', 'Image size must be less than 5MB.');
        return;
      }

      setProfileFormData(prev => ({
        ...prev,
        newImage: file
      }));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let newAvatarUrl = profileFormData.avatar;
      
      // If user selected a new image, resize and convert it
      if (profileFormData.newImage) {
        newAvatarUrl = await resizeImage(profileFormData.newImage);
      }

      // Here you would typically update the user profile in your backend
      // For now, we'll just show a success message
      showSuccess('Profile Updated!', 'Your profile has been updated successfully.');
      
      // Update the avatar in the form data
      setProfileFormData(prev => ({
        ...prev,
        avatar: newAvatarUrl,
        newImage: null
      }));
      
    } catch (error) {
      showError('Error', 'Failed to update profile. Please try again.');
    }
  };
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      role: 'admin',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 234 567 8901',
      role: 'read',
      createdAt: '2024-01-16'
    }
  ]);
  
  const {
    notifications,
    NotificationContainer,
    showSuccess,
    showError,
    removeNotification
  } = useNotificationSystem();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    image: null as File | null
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        showError('Invalid File Type', 'Please upload JPG, PNG, PDF, or DOCX files only.');
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        showError('File Too Large', 'File size must be less than 10MB.');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        canvas.width = 200;
        canvas.height = 200;
        
        // Calculate aspect ratio and crop to center
        const aspectRatio = img.width / img.height;
        let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;
        
        if (aspectRatio > 1) {
          // Wide image - crop width
          sourceWidth = img.height;
          sourceX = (img.width - sourceWidth) / 2;
        } else {
          // Tall image - crop height
          sourceHeight = img.width;
          sourceY = (img.height - sourceHeight) / 2;
        }
        
        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, 200, 200);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.role) {
      showError('Validation Error', 'Please fill in all required fields.');
      return;
    }

    try {
      let imageUrl = '';
      if (formData.image && formData.image.type.startsWith('image/')) {
        imageUrl = await resizeImage(formData.image);
      }

      const newUser: User = {
        id: selectedUser ? selectedUser.id : Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        image: imageUrl || selectedUser?.image,
        createdAt: selectedUser ? selectedUser.createdAt : new Date().toISOString().split('T')[0]
      };

      if (selectedUser) {
        setUsers(prev => prev.map(user => user.id === selectedUser.id ? newUser : user));
        showSuccess('User Updated!', 'User information has been updated successfully.');
        setShowEditUserModal(false);
      } else {
        setUsers(prev => [...prev, newUser]);
        showSuccess('User Added!', 'New user has been added successfully.');
        setShowAddUserModal(false);
      }

      setFormData({ name: '', email: '', phone: '', role: '', image: null });
      setSelectedUser(null);
    } catch (error) {
      showError('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      image: null
    });
    setShowEditUserModal(true);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        user.id,
        `"${user.name}"`,
        user.email,
        user.phone,
        user.role,
        user.createdAt
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccess('Export Complete!', 'Users data has been exported to CSV successfully.');
  };

  const closeModal = () => {
    setShowAddUserModal(false);
    setShowEditUserModal(false);
    setSelectedUser(null);
    setFormData({ name: '', email: '', phone: '', role: '', image: null });
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const handleMenuItemClick = (itemId: string) => {
    setActiveView(itemId);
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboardView();
      case 'users':
        return isAdminUser ? renderUsersView() : renderAccessDenied();
      case 'profile':
        return renderProfileView();
      case 'analytics':
        return isAdminUser ? renderAnalyticsView() : renderAccessDenied();
      case 'settings':
        return renderSettingsView();
      default:
        return renderDashboardView();
    }
  };

  const renderAccessDenied = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <HiExclamationCircle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h3>
      <p className="text-gray-600">You don't have permission to access this section.</p>
    </div>
  );

  const renderProfileView = () => {
    return (
      <div className="w-full max-w-none overflow-y-auto max-h-[calc(100vh-8rem)] custom-scrollbar">
        {/* First Row - Profile Picture and Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start space-x-8">
            {/* Left Side - Large Profile Image */}
            <div className="flex-shrink-0">
              <div className="relative">
                {profileFormData.newImage ? (
                  <img 
                    src={URL.createObjectURL(profileFormData.newImage)} 
                    alt="Profile Preview" 
                    className="w-40 h-40 rounded-full object-cover border-8 border-white shadow-xl"
                  />
                ) : profileFormData.avatar ? (
                  <img 
                    src={profileFormData.avatar} 
                    alt="Profile" 
                    className="w-40 h-40 rounded-full object-cover border-8 border-white shadow-xl"
                  />
                ) : (
                  <div className="w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-8 border-white shadow-xl">
                    <span className="text-white text-5xl font-medium">
                      {currentUser ? `${currentUser.firstName[0]}${currentUser.lastName[0]}` : 'U'}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => profileImageInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-lg"
                >
                  <HiCamera className="w-6 h-6" />
                </button>
                <input
                  type="file"
                  ref={profileImageInputRef}
                  onChange={handleProfileImageChange}
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                />
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">Click the camera icon to change</p>
                <p className="text-xs text-gray-400">your profile picture</p>
              </div>
            </div>

            {/* Right Side - User Information */}
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'User Profile'}
                </h1>
                <p className="text-lg text-gray-600 mb-4">Welcome to your profile dashboard</p>
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <HiCheckCircle className="w-4 h-4 mr-2" />
                    {currentUser?.role === 'admin' ? 'Administrator' : 'User'}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Active
                  </span>
                </div>
              </div>

              {/* Account Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-500">
                      <HiUser className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-800">Member Since</p>
                      <p className="text-lg font-bold text-blue-900">
                        {new Date(currentUser?.createdAt || '').toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-500">
                      <HiShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-800">Permissions</p>
                      <p className="text-lg font-bold text-green-900">{currentUser?.permissions.length || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-500">
                      <HiClock className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-800">Last Login</p>
                      <p className="text-lg font-bold text-purple-900">Today</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row - Update Profile Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Update Profile Information</h2>
            <p className="text-gray-600">Keep your personal information up to date</p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={profileFormData.firstName}
                    onChange={handleProfileInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={profileFormData.lastName}
                    onChange={handleProfileInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Enter last name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={profileFormData.username}
                    onChange={handleProfileInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    placeholder="Username"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileFormData.email}
                    onChange={handleProfileInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                    <div className="flex items-center">
                      <span className="capitalize font-medium">{currentUser?.role}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({currentUser?.permissions.join(', ')})
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Role and permissions are managed by administrators</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                >
                  Update Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Reset form to original values
                    if (currentUser) {
                      setProfileFormData({
                        firstName: currentUser.firstName || '',
                        lastName: currentUser.lastName || '',
                        email: currentUser.email || '',
                        username: currentUser.username || '',
                        avatar: currentUser.avatar || null,
                        newImage: null
                      });
                    }
                  }}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                >
                  Reset Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderDashboardView = () => {
    if (currentUser?.role === 'user') {
      // User Dashboard
      return (
        <div>
          {/* Welcome Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome back, {currentUser.firstName}!
            </h3>
            <p className="text-gray-600 mb-4">
              Here's a quick overview of your account and recent activity.
            </p>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-50">
                  <HiUser className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Account Status</p>
                  <p className="text-2xl font-bold text-gray-900">Active</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-50">
                  <HiCheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Permissions</p>
                  <p className="text-2xl font-bold text-gray-900">{currentUser.permissions.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setActiveView('profile')}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <HiUser className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Update Profile</h4>
                    <p className="text-sm text-gray-500">Manage your personal information</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveView('settings')}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors duration-200 text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <HiCog className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Account Settings</h4>
                    <p className="text-sm text-gray-500">Configure your preferences</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Admin Dashboard
    return (
      <div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-50">
                <HiUsers className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-50">
                <HiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-50">
                <HiOfficeBuilding className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Roles</p>
                <p className="text-2xl font-bold text-gray-900">{new Set(users.map(u => u.role)).size}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome to Admin Dashboard
          </h3>
          <p className="text-gray-600 mb-4">
            Manage users, view analytics, and configure system settings. Select a menu item from the sidebar to get started.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveView('users')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Manage Users
            </button>
            <button
              onClick={() => setActiveView('analytics')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              View Analytics
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderUsersView = () => (
    <div>
      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Users List</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  onClick={() => handleEditUser(user)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.image ? (
                        <img className="h-10 w-10 rounded-full object-cover" src={user.image} alt={user.name} />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditUser(user);
                      }}
                      className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
      <p className="text-gray-600">Analytics dashboard coming soon...</p>
    </div>
  );

  const renderSettingsView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
      <p className="text-gray-600">Settings panel coming soon...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onLogout={handleLogout}
        activeItem={activeView}
        onMenuItemClick={handleMenuItemClick}
      />

      {/* Main Content */}
      <div className="flex-1 w-full overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeView === 'dashboard' && 'Dashboard'}
                {activeView === 'users' && 'User Management'}
                {activeView === 'profile' && 'My Profile'}
                {activeView === 'analytics' && 'Analytics'}
                {activeView === 'settings' && 'Settings'}
              </h1>
              <p className="text-gray-600 text-sm">
                {activeView === 'dashboard' && (currentUser?.role === 'admin' ? 'Admin Dashboard Overview' : 'Your Personal Dashboard')}
                {activeView === 'users' && 'Manage your users and their information'}
                {activeView === 'profile' && 'Manage your personal information'}
                {activeView === 'analytics' && 'View detailed analytics and reports'}
                {activeView === 'settings' && 'Configure your application settings'}
              </p>
            </div>
            {activeView === 'users' && (
              <div className="flex space-x-3">
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <HiDownload className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <HiPlus className="w-4 h-4" />
                  <span>Add User</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className={activeView === 'profile' ? 'p-3 overflow-hidden' : 'p-6'}>
          {renderMainContent()}
        </main>
      </div>

      {/* Add/Edit User Modal */}
      {(showAddUserModal || showEditUserModal) && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/20 bg-opacity-20 flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {selectedUser ? 'Edit User Profile' : 'Add New User'}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {selectedUser ? 'Update user information and profile details' : 'Create a new user account with profile information'}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-150 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <HiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Profile Image Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-blue-200">
                    Profile Picture
                  </h4>
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      {(formData.image || selectedUser?.image) ? (
                        <img 
                          src={formData.image ? URL.createObjectURL(formData.image) : selectedUser?.image} 
                          alt="Profile Preview" 
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                          <span className="text-white text-2xl font-medium">
                            {formData.name ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-lg"
                      >
                        <HiCamera className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".jpg,.jpeg,.png,.pdf,.docx"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-700 hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 font-medium"
                      >
                        Choose Profile Image
                      </button>
                      <p className="text-sm text-gray-500 mt-2">
                        JPG, PNG, PDF, DOCX (max 10MB)
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Click the camera icon or button above to change the profile picture
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal Information Section */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                        Role *
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                        required
                      >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="write">Write</option>
                        <option value="read">Read</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Account Information Section */}
                {selectedUser && (
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Account Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          User ID
                        </label>
                        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600">
                          #{selectedUser.id}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Created Date
                        </label>
                        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600">
                          {new Date(selectedUser.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                    >
                      {selectedUser ? 'Update User' : 'Create User'}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Notification Container */}
      <NotificationContainer 
        notifications={notifications} 
        onClose={removeNotification} 
      />
    </div>
  );
};

export default Dashboard;
