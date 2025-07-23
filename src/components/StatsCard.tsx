import React from 'react';
import { 
  HiUsers, 
  HiCheckCircle, 
  HiOfficeBuilding, 
  HiClipboardList, 
  HiClock, 
  HiExclamationCircle,
  HiUser,
  HiChartBar
} from 'react-icons/hi';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'indigo' | 'default';
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  className?: string;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  variant = 'blue',
  trend,
  className = '',
  onClick
}) => {
  const getIcon = (title: string) => {
    const iconClass = "w-5 h-5 text-white drop-shadow-sm";
    
    switch (title.toLowerCase()) {
      case 'total users':
        return <HiUsers className={iconClass} />;
      case 'active users':
        return <HiCheckCircle className={iconClass} />;
      case 'roles':
        return <HiOfficeBuilding className={iconClass} />;
      case 'total tasks':
        return <HiClipboardList className={iconClass} />;
      case 'in progress':
      case 'in-progress':
        return <HiClock className={iconClass} />;
      case 'completed':
        return <HiCheckCircle className={iconClass} />;
      case 'pending':
        return <HiExclamationCircle className={iconClass} />;
      case 'member since':
      case 'account status':
        return <HiUser className={iconClass} />;
      case 'permissions':
        return <HiCheckCircle className={iconClass} />;
      case 'analytics':
      case 'statistics':
        return <HiChartBar className={iconClass} />;
      default:
        return <HiChartBar className={iconClass} />;
    }
  };

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'blue':
        return {
          background: 'bg-gradient-to-br from-blue-50 via-blue-25 to-indigo-50',
          iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
          textPrimary: 'text-blue-700',
          textSecondary: 'text-blue-900'
        };
      case 'green':
        return {
          background: 'bg-gradient-to-br from-emerald-50 via-green-25 to-teal-50',
          iconBg: 'bg-gradient-to-br from-emerald-500 to-green-600',
          textPrimary: 'text-emerald-700',
          textSecondary: 'text-emerald-900'
        };
      case 'purple':
        return {
          background: 'bg-gradient-to-br from-purple-50 via-violet-25 to-indigo-50',
          iconBg: 'bg-gradient-to-br from-purple-500 to-violet-600',
          textPrimary: 'text-purple-700',
          textSecondary: 'text-purple-900'
        };
      case 'yellow':
        return {
          background: 'bg-gradient-to-br from-amber-50 via-yellow-25 to-orange-50',
          iconBg: 'bg-gradient-to-br from-amber-500 to-yellow-600',
          textPrimary: 'text-amber-700',
          textSecondary: 'text-amber-900'
        };
      case 'red':
        return {
          background: 'bg-gradient-to-br from-red-50 via-rose-25 to-pink-50',
          iconBg: 'bg-gradient-to-br from-red-500 to-rose-600',
          textPrimary: 'text-red-700',
          textSecondary: 'text-red-900'
        };
      case 'indigo':
        return {
          background: 'bg-gradient-to-br from-indigo-50 via-blue-25 to-slate-50',
          iconBg: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
          textPrimary: 'text-indigo-700',
          textSecondary: 'text-indigo-900'
        };
      default:
        return {
          background: 'bg-gradient-to-br from-slate-50 via-gray-25 to-zinc-50',
          iconBg: 'bg-gradient-to-br from-slate-500 to-gray-600',
          textPrimary: 'text-slate-700',
          textSecondary: 'text-slate-900'
        };
    }
  };

  const styles = getVariantStyles(variant);

  return (
    <div 
      className={`${styles.background} rounded-xl px-6 py-4 shadow-sm hover:shadow-md transition-all duration-200 border border-white/20 backdrop-blur-sm ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-xl ${styles.iconBg} shadow-lg ring-2 ring-white/10`}>
            {getIcon(title)}
          </div>
          <div className="flex-1">
            <p className={`text-xs font-semibold uppercase tracking-wide ${styles.textPrimary} opacity-80`}>
              {title}
            </p>
            <div className="flex items-baseline space-x-3 mt-1">
              <p className={`text-3xl font-bold ${styles.textSecondary} tracking-tight`}>
                {value}
              </p>
              {trend && (
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                  trend.isPositive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  <span className={trend.isPositive ? 'text-green-500' : 'text-red-500'}>
                    {trend.isPositive ? '↗' : '↘'}
                  </span>
                  <span>
                    {Math.abs(trend.value)}%
                  </span>
                </div>
              )}
            </div>
            {subtitle && (
              <p className={`text-sm ${styles.textPrimary} mt-2 opacity-70 font-medium`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
