import React from 'react';
import { UserRole } from '../types';

interface Props {
  role: UserRole;
}

const RoleBadge: React.FC<Props> = ({ role }) => {
  const styles = {
    [UserRole.OWNER]: "bg-purple-100 text-purple-700 border-purple-200",
    [UserRole.COMPLIANCE_OFFICER]: "bg-blue-100 text-blue-700 border-blue-200",
    [UserRole.BREWERY_MANAGER]: "bg-amber-100 text-amber-700 border-amber-200",
    [UserRole.BREWER]: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[role]}`}>
      {role.replace('_', ' ')}
    </span>
  );
};

export default RoleBadge;
