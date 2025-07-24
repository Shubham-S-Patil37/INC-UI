import React, {useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar';
import StatsCard from '../../components/StatsCard';
import UserModal from '../../components/UserModal';
import TaskModal from '../../components/TaskModal';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { selectUser, selectIsAdmin } from '../../store/selectors/authSelectors';
import { selectAllUsers } from '../../store/selectors/usersSelectors';
import { selectAllTasks, selectUserTasks } from '../../store/selectors/tasksSelectors';
import { logout } from '../../store/slices/authSlice';
import { 
  fetchUsers, 
  createUser, 
  updateUserAPI, 
  deleteUserAPI 
} from '../../store/slices/usersSlice';
import { createTask, fetchTasks, updateTaskApi } from '../../store/slices/tasksSlice';
import useNotificationSystem from '../../components/notificationPopup';
import { 
  HiCamera, 
  HiUser, 
  HiCheckCircle, 
  HiCog, 
  HiExclamationCircle,
  HiPlus,
  HiDownload,
  HiEye
} from 'react-icons/hi';
import type { User } from '../../store/slices/usersSlice';
import type { Task } from '../../store/slices/tasksSlice';
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
  
  const users = useAppSelector(selectAllUsers);
  const tasks = useAppSelector(selectAllTasks);
  const userTasks = useAppSelector(selectUserTasks(currentUser?._id || 0));

  console.log('Current tasks:', userTasks);

  const [profileFormData, setProfileFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    username: currentUser?.username || '',
    avatar: currentUser?.avatar || null as string | null,
    newImage: null as File | null
  });

  useEffect(() => {
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

  // Fetch users when component mounts
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    debugger
  dispatch(fetchTasks());
}, [dispatch]); 

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
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        showError('Invalid File Type', 'Please upload JPG or PNG images only.');
        return;
      }

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
      
      if (profileFormData.newImage) {
        newAvatarUrl = await resizeImage(profileFormData.newImage);
      }

      showSuccess('Profile Updated!', 'Your profile has been updated successfully.');
      
      setProfileFormData(prev => ({
        ...prev,
        avatar: newAvatarUrl,
        newImage: null
      }));
      
    } catch (error) {
      showError('Error', 'Failed to update profile. Please try again.');
    }
  };
  
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: ''
  });
  
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
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        showError('Invalid File Type', 'Please upload JPG, PNG, PDF, or DOCX files only.');
        return;
      }

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
        
        const aspectRatio = img.width / img.height;
        let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;
        
        if (aspectRatio > 1) {
          sourceWidth = img.height;
          sourceX = (img.width - sourceWidth) / 2;
        } else {
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

      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        image: imageUrl || selectedUser?.image,
      };

      if (selectedUser) {
        // Update existing user via API
        await dispatch(updateUserAPI({ 
          ...userData, 
          id: selectedUser.id,
          createdAt: selectedUser.createdAt 
        })).unwrap();
        showSuccess('User Updated!', 'User information has been updated successfully.');
        setShowEditUserModal(false);
      } else {
        // Create new user via API
        await dispatch(createUser(userData)).unwrap();
        showSuccess('User Added!', 'New user has been added successfully.');
        setShowAddUserModal(false);
      }

      setFormData({ name: '', email: '', phone: '', role: '', image: null });
      setSelectedUser(null);
    } catch (error) {
      showError('Error', error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await dispatch(deleteUserAPI(userId)).unwrap();
        showSuccess('User Deleted!', 'User has been deleted successfully.');
      } catch (error) {
        showError('Error', error instanceof Error ? error.message : 'Failed to delete user.');
      }
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

  const canCreateTasks = () => {
    return currentUser?.role === 'admin' || 
           currentUser?.permissions?.includes('Write') ||
           currentUser?.permissions?.includes('Admin');
  };

  const handleTaskInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskFormData.title || !taskFormData.description || !taskFormData.dueDate) {
      showError('Validation Error', 'Please fill in all required fields.');
      return;
    }

    try {
      // const assignedUser = users.find(u => u.id === parseInt(taskFormData.assignedTo));
      // if (!assignedUser) {
      //   showError('Error', 'Selected user not found.');
      //   return;
      // }

      const newTask: Task = {
        // _id: selectedTask ? selectedTask._id : Date.now(),
        title: taskFormData.title,
        description: taskFormData.description,
        assignedTo: parseInt(taskFormData.assignedTo),
        assignedBy: currentUser?._id || 1,
        status: selectedTask ? selectedTask.status : 'pending',
        priority: taskFormData.priority,
        dueDate: taskFormData.dueDate,
        createdAt: selectedTask ? selectedTask.createdAt : new Date().toISOString().split('T')[0],
      };

      if (selectedTask) {
        await dispatch(updateTaskApi(newTask)).unwrap();
        await dispatch(fetchTasks()); // <-- Add this line to refresh the task list
        showSuccess('Task Updated!', 'Task has been updated successfully.');
        setShowEditTaskModal(false);
      } else {
        await dispatch(createTask(newTask)).unwrap();
        await dispatch(fetchTasks());
        showSuccess('Task Created!', 'New task has been created and assigned successfully.');
        setShowAddTaskModal(false);
      }

      setTaskFormData({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' });
      setSelectedTask(null);
    } catch (error) {
      showError('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setTaskFormData({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo.toString(),
      priority: task.priority,
      dueDate: task.dueDate
    });
    setShowEditTaskModal(true);
  };

  const handleTaskStatusChange = (taskId: any, newStatus: 'pending' | 'in-progress' | 'completed') => {
    // dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
    showSuccess('Status Updated!', 'Task status has been updated successfully.');
  };

  const closeTaskModal = () => {
    setShowAddTaskModal(false);
    setShowEditTaskModal(false);
    setSelectedTask(null);
    setTaskFormData({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' });
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
      case 'tasks':
        return renderTasksView();
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start space-x-8">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatsCard
                  title="Permissions"
                  value={currentUser?.permissions.length || 0}
                  variant="green"
                />

                <StatsCard
                  title="Last Login"
                  value="Today"
                  variant="purple"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Update Profile Information</h2>
            <p className="text-gray-600">Keep your personal information up to date</p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-8">
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
    if (!isAdminUser && currentUser?.role !== 'admin') {
      return (
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome back, {currentUser?.firstName}!
            </h3>
            <p className="text-gray-600 mb-4">
              Here's a quick overview of your account and recent activity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <StatsCard
                title="Account Status"
                value="Active"
                variant="blue"
              />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <StatsCard
                title="Permissions"
                value={currentUser?.permissions?.length || 0}
                variant="green"
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <StatsCard
                title="Tasks Assigned"
                value={tasks.filter(task => task.assignedTo === currentUser?._id).length}
                variant="purple"
              />
            </div>
          </div>

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

    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <StatsCard
            title="Total Users"
            value={users.length}
            variant="blue"
          />
          
          <StatsCard
            title="Active Users"
            value={users.length}
            variant="green"
          />
          
          <StatsCard
            title="Roles"
            value={new Set(users.map(u => u.role)).size}
            variant="purple"
          />

          <StatsCard
            title="Total Tasks"
            value={tasks.length}
            variant="indigo"
          />

          <StatsCard
            title="Completed Tasks"
            value={tasks.filter(task => task.status === 'completed').length}
            variant="green"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome to Admin Dashboard
          </h3>
          <p className="text-gray-600 mb-4">
            Manage users, track tasks, update your profile, and configure system settings. Select a menu item from the sidebar to get started.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setActiveView('users')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Manage Users
            </button>
            <button
              onClick={() => setActiveView('tasks')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Manage Tasks
            </button>
            <button
              onClick={() => setActiveView('profile')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderUsersView = () => (
    <div>
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

  const renderTasksView = () => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'completed': return 'bg-green-100 text-green-800';
        case 'in-progress': return 'bg-blue-100 text-blue-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'high': return 'bg-red-100 text-red-800';
        case 'medium': return 'bg-yellow-100 text-yellow-800';
        case 'low': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatsCard
            title="Total Tasks"
            value={userTasks.length}
            variant="blue"
          />
          
          <StatsCard
            title="In Progress"
            value={userTasks.filter(t => t.status === 'in-progress').length}
            variant="yellow"
          />
          
          <StatsCard
            title="Completed"
            value={userTasks.filter(t => t.status === 'completed').length}
            variant="green"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
            <p className="text-sm text-gray-600 mt-1">
              {canCreateTasks() ? 'Manage and assign tasks to team members' : 'View your assigned tasks'}
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr 
                    key={task._id} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-500 max-w-md truncate">{task.description}</div>
                        <div className="text-xs text-gray-400 mt-1">Created by: {task.assignedByName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{task.assignedToName}</div>
                      <div className="text-xs text-gray-500">ID: {task.assignedTo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={task.status}
                        onChange={(e) => handleTaskStatusChange(task?._id, e.target.value as any)}
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border-0 ${getStatusColor(task.status)}`}
                        disabled={!canCreateTasks() && task.assignedTo !== currentUser?._id}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {canCreateTasks() ? (
                        <button
                          onClick={() => handleEditTask(task)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                        >
                          Edit
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                          }}
                          className="text-gray-600 hover:text-gray-900 transition-colors duration-150"
                        >
                          <HiEye className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderSettingsView = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
      <p className="text-gray-600">Settings panel coming soon...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onLogout={handleLogout}
        activeItem={activeView}
        onMenuItemClick={handleMenuItemClick}
      />

      <div className="flex-1 w-full overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeView === 'dashboard' && 'Dashboard'}
                {activeView === 'users' && 'User Management'}
                {activeView === 'profile' && 'My Profile'}
                {activeView === 'tasks' && 'Task Management'}
                {activeView === 'settings' && 'Settings'}
              </h1>
              <p className="text-gray-600 text-sm">
                {activeView === 'dashboard' && (currentUser?.role === 'admin' ? 'Admin Dashboard Overview' : 'Your Personal Dashboard')}
                {activeView === 'users' && 'Manage your users and their information'}
                {activeView === 'profile' && 'Manage your personal information'}
                {activeView === 'tasks' && 'Manage tasks and assignments'}
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
            {activeView === 'tasks' && canCreateTasks() && (
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <HiPlus className="w-4 h-4" />
                  <span>Create Task</span>
                </button>
              </div>
            )}
          </div>
        </header>

     <main className={activeView === 'profile' ? 'p-3 overflow-hidden' : 'p-6'}>
          {renderMainContent()}
        </main>
      </div>

      <UserModal
        isOpen={showAddUserModal || showEditUserModal}
        isEdit={showEditUserModal}
        selectedUser={selectedUser}
        formData={formData}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
        onFileChange={handleFileChange}
      />

      <TaskModal
        isOpen={showAddTaskModal || showEditTaskModal}
        isEdit={showEditTaskModal}
        selectedTask={selectedTask}
        users={users}
        formData={taskFormData}
        onClose={closeTaskModal}
        onSubmit={handleTaskSubmit}
        onInputChange={handleTaskInputChange}
      />

      <NotificationContainer 
        notifications={notifications} 
        onClose={removeNotification} 
      />
    </div>
  );
};

export default Dashboard;
