import React from 'react';

interface InfoCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ label, value, unit, icon }) => {
  return (
    <div className="bg-lightSurface dark:bg-darkSurface rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col items-center">
        {icon && (
          <span className="material-icons text-xl mb-1 text-gray-600 dark:text-gray-400">
            {icon}
          </span>
        )}
        <span className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          {label}
        </span>
        <div className="font-mono font-bold text-2xl mt-1">
          {typeof value === 'number' ? value.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1
          }) : value}
        </div>
        {unit && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

export default InfoCard;
