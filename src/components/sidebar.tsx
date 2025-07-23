import React from 'react';
import { useAppSelector } from '../hooks/redux';
import { selectUser, selectUserRole } from '../store/selectors/authSelectors';
import { 
  HiChartBar, 
  HiUser, 
  HiUsers, 
  HiClipboardList, 
  HiCog, 
  HiChevronRight, 
  HiChevronLeft, 
  HiLogout 
} from 'react-icons/hi';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onLogout?: () => void;
  activeItem: string;
  onMenuItemClick: (itemId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, onLogout, activeItem, onMenuItemClick }) => {
  const currentUser = useAppSelector(selectUser);
  const userRole = useAppSelector(selectUserRole);

  const allMenuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      roles: ['admin', 'user'], // Available to both admin and user
      icon: <HiChartBar className="w-5 h-5" />
    },
    {
      id: 'profile',
      name: 'My Profile',
      roles: ['admin', 'user'], // Available to both admin and user
      icon: <HiUser className="w-5 h-5" />
    },
    {
      id: 'users',
      name: 'User Management',
      roles: ['admin'], // Only available to admin
      icon: <HiUsers className="w-5 h-5" />
    },
    {
      id: 'tasks',
      name: 'Task Management',
      roles: ['admin', 'user'], // Available to both admin and users with appropriate permissions
      icon: <HiClipboardList className="w-5 h-5" />
    },
    {
      id: 'settings',
      name: 'Settings',
      roles: ['admin', 'user'], // Available to both admin and user
      icon: <HiCog className="w-5 h-5" />
    }
  ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item => 
    !userRole || item.roles.includes(userRole)
  );

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-screen flex flex-col border-r border-gray-200`}>
      
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">INC</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
            </div>
          )}
          
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {isCollapsed ? (
              <HiChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <HiChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  onMenuItemClick(item.id);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  activeItem === item.id
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={isCollapsed ? item.name : ''}
              >
                <div className={`flex-shrink-0 ${activeItem === item.id ? 'text-blue-600' : 'text-gray-400'}`}>
                  {item.icon}
                </div>
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.name}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} mb-3`}>
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {currentUser ? `${currentUser.firstName[0]}${currentUser.lastName[0]}` : 'U'}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser?.role === 'admin' ? 'Administrator' : 'User'}
              </p>
            </div>
          )}
        </div>
        
        {onLogout && (
          <button
            onClick={onLogout}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200`}
            title={isCollapsed ? 'Logout' : ''}
          >
            <HiLogout className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="font-medium text-sm">Logout</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
