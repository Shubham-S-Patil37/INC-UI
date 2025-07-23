import { useEffect, useState } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export interface NotificationContainerProps {
  notifications: NotificationProps[];
  onClose: (id: string) => void;
}

const useNotificationSystem = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const NotificationPopup: React.FC<NotificationProps> = ({
    id,
    type,
    title,
    message,
    duration = 5000,
    onClose
  }) => {
    useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          onClose(id);
        }, duration);
        return () => clearTimeout(timer);
      }
    }, [duration, id, onClose]);

    const getStyles = () => {
      switch (type) {
        case 'success':
          return 'bg-green-50 border-green-200 text-green-800';
        case 'error':
          return 'bg-red-50 border-red-200 text-red-800';
        case 'warning':
          return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        case 'info':
          return 'bg-blue-50 border-blue-200 text-blue-800';
        default:
          return 'bg-gray-50 border-gray-200 text-gray-800';
      }
    };

    return (
      <div className={`fixed bottom-4 right-4 z-50 max-w-sm w-full shadow-lg rounded-lg border p-4 ${getStyles()}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="font-medium">{title}</p>
            <p className="text-sm mt-1">{message}</p>
          </div>
          <button
            onClick={() => onClose(id)}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>
    );
  };

  const NotificationContainer: React.FC<NotificationContainerProps> = ({
    notifications,
    onClose
  }) => {
    return (
      <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
        {notifications.map((notification) => (
          <NotificationPopup key={notification.id} {...notification} onClose={onClose} />
        ))}
      </div>
    );
  };

  const addNotification = (type: NotificationType, title: string, message: string, duration?: number) => {
    const id = Date.now().toString();
    const notification: NotificationProps = {
      id,
      type,
      title,
      message,
      duration,
      onClose: removeNotification
    };
    setNotifications(prev => [...prev, notification]);
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showSuccess = (title: string, message: string, duration?: number) =>
    addNotification('success', title, message, duration);

  const showError = (title: string, message: string, duration?: number) =>
    addNotification('error', title, message, duration);

  const showWarning = (title: string, message: string, duration?: number) =>
    addNotification('warning', title, message, duration);

  const showInfo = (title: string, message: string, duration?: number) =>
    addNotification('info', title, message, duration);

  return {
    notifications,
    NotificationContainer,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification
  };
};

export default useNotificationSystem;
