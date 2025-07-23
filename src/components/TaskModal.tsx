import React from 'react';
import { HiX } from 'react-icons/hi';
import type { User } from '../store/slices/usersSlice';
import type { Task } from '../store/slices/tasksSlice';

interface TaskModalProps {
  isOpen: boolean;
  isEdit: boolean;
  selectedTask: Task | null;
  users: User[];
  formData: {
    title: string;
    description: string;
    assignedTo: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
  };
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  isEdit,
  selectedTask,
  users,
  formData,
  onClose,
  onSubmit,
  onInputChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/20 bg-opacity-20 flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">
                {isEdit ? 'Edit Task' : 'Create New Task'}
              </h3>
              <p className="text-gray-600 mt-1">
                {isEdit ? 'Update task information and assignment' : 'Create a new task and assign it to a team member'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-150 p-2 hover:bg-gray-100 rounded-lg"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Task Information Section */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Task Information
              </h4>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Enter task title"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={onInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
                    placeholder="Enter task description"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Assignment and Priority Section */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Assignment & Priority
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-2">
                    Assign To *
                  </label>
                  <select
                    id="assignedTo"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    required
                  >
                    <option value="">Select User</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                    Priority *
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Task Status Section (only for editing) */}
            {selectedTask && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Task Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Task ID
                    </label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600">
                      #{selectedTask.id}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 capitalize">
                      {selectedTask.status.replace('-', ' ')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Created Date
                    </label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600">
                      {new Date(selectedTask.createdAt).toLocaleDateString()}
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
                  {isEdit ? 'Update Task' : 'Create Task'}
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

export default TaskModal;
