import React, { useRef } from 'react';
import { HiX, HiCamera } from 'react-icons/hi';
import type { User } from '../store/slices/usersSlice';

interface UserModalProps {
  isOpen: boolean;
  isEdit: boolean;
  selectedUser: User | null;
  formData: {
    name: string;
    email: string;
    phone: string;
    role: string;
    image: File | null;
    password: string;
    userName: string; // <-- Add this line
  };
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  isEdit,
  selectedUser,
  formData,
  onClose,
  onSubmit,
  onInputChange,
  onFileChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/20 bg-opacity-20 flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">
                {isEdit ? 'Edit User Profile' : 'Add New User'}
              </h3>
              <p className="text-gray-600 mt-1">
                {isEdit ? 'Update user information and profile details' : 'Create a new user account with profile information'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-150 p-2 hover:bg-gray-100 rounded-lg"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-8">
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
                    onChange={onFileChange}
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
                    onChange={onInputChange}
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
                    onChange={onInputChange}
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
                    onChange={onInputChange}
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
                    onChange={onInputChange}
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

            {/* Username Section */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="Enter username"
                required
              />
            </div>

            {/* Password Section - Only for Add User */}
            {!isEdit && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter password"
                  required
                />
              </div>
            )}

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
                      #{selectedUser._id}
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
                  {isEdit ? 'Update User' : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
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
  );
};

export default UserModal;
