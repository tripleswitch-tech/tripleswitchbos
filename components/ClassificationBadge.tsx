import React from 'react';
import { Classification } from '../types';
import { Lock, Globe, Shield, FileKey } from 'lucide-react';

interface Props {
  level: Classification;
  size?: 'sm' | 'md';
}

const ClassificationBadge: React.FC<Props> = ({ level, size = 'sm' }) => {
  const styles = {
    [Classification.PUBLIC]: "bg-green-100 text-green-700 border-green-200",
    [Classification.INTERNAL]: "bg-blue-100 text-blue-700 border-blue-200",
    [Classification.CONFIDENTIAL]: "bg-amber-100 text-amber-700 border-amber-200",
    [Classification.RESTRICTED]: "bg-red-100 text-red-700 border-red-200",
  };

  const icons = {
    [Classification.PUBLIC]: Globe,
    [Classification.INTERNAL]: Shield,
    [Classification.CONFIDENTIAL]: Lock,
    [Classification.RESTRICTED]: FileKey,
  };

  const Icon = icons[level];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center space-x-1.5 border rounded-full font-medium ${styles[level]} ${sizeClasses}`}>
      <Icon size={size === 'sm' ? 10 : 12} />
      <span>{level}</span>
    </span>
  );
};

export default ClassificationBadge;
