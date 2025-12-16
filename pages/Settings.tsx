import React, { useState } from 'react';
import { MOCK_USERS, CURRENT_USER } from '../constants';
import { User, UserRole, UserStatus } from '../types';
import RoleBadge from '../components/RoleBadge';
import { 
  Users, 
  Shield, 
  Settings as SettingsIcon, 
  Plus, 
  Search,
  Trash2,
  Lock,
  Edit2,
  X,
  CheckCircle,
  AlertCircle,
  FileCheck,
  Archive,
  ShieldAlert,
  Key,
  Check,
  Briefcase
} from 'lucide-react';

// --- Helper Components ---

const RoleDescription = ({ role }: { role: UserRole }) => {
  switch (role) {
    case UserRole.OWNER:
      return <span className="text-xs text-slate-500">Full system access, including billing and security.</span>;
    case UserRole.COMPLIANCE_OFFICER:
      return <span className="text-xs text-slate-500">Can manage forms, view audit logs, and approve compliance docs.</span>;
    case UserRole.BREWERY_MANAGER:
      return <span className="text-xs text-slate-500">Can manage team members and view all operational data.</span>;
    case UserRole.BREWER:
      return <span className="text-xs text-slate-500">Standard access to documents and forms submission.</span>;
    default:
      return null;
  }
};

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState<User>({ ...user });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-slate-900">Edit Team Member</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role & Privileges</label>
            <div className="space-y-2 border border-gray-200 rounded-lg p-2 max-h-48 overflow-y-auto">
              {Object.values(UserRole).map((role) => (
                <label 
                  key={role} 
                  className={`flex items-start p-2 rounded cursor-pointer border transition-all ${
                    formData.role === role 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="role" 
                    value={role}
                    checked={formData.role === role}
                    onChange={() => setFormData({...formData, role})}
                    className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                    disabled={user.id === CURRENT_USER.id} // Prevent locking oneself out
                  />
                  <div>
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${formData.role === role ? 'text-blue-900' : 'text-slate-700'}`}>
                        {role.replace('_', ' ')}
                      </span>
                      {formData.role === role && <CheckCircle size={14} className="ml-2 text-blue-600" />}
                    </div>
                    <RoleDescription role={role} />
                  </div>
                </label>
              ))}
            </div>
            {user.id === CURRENT_USER.id && (
              <p className="text-xs text-amber-600 mt-2 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                You cannot change your own role.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Account Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value as UserStatus})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
            >
              {Object.values(UserStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Permissions Constants ---

const PERMISSION_ROWS = [
  { id: 'view_public', label: 'View Public Docs', category: 'Document Access' },
  { id: 'view_internal', label: 'View Internal Docs', category: 'Document Access' },
  { id: 'view_confidential', label: 'View Confidential Docs', category: 'Document Access' },
  { id: 'view_restricted', label: 'View Restricted Docs', category: 'Document Access' },
  { id: 'upload_docs', label: 'Upload New Documents', category: 'Document Operations' },
  { id: 'delete_docs', label: 'Delete Documents', category: 'Document Operations' },
  { id: 'submit_forms', label: 'Submit Forms', category: 'Form Operations' },
  { id: 'approve_forms', label: 'Approve Forms', category: 'Form Operations' },
  { id: 'manage_users', label: 'Manage Users', category: 'System Administration' },
  { id: 'view_audit', label: 'View Audit Logs', category: 'System Administration' },
];

const INITIAL_ROLE_PERMISSIONS: Record<string, string[]> = {
  [UserRole.OWNER]: PERMISSION_ROWS.map(r => r.id),
  [UserRole.COMPLIANCE_OFFICER]: ['view_public', 'view_internal', 'view_confidential', 'view_restricted', 'upload_docs', 'submit_forms', 'approve_forms', 'view_audit'],
  [UserRole.BREWERY_MANAGER]: ['view_public', 'view_internal', 'view_confidential', 'upload_docs', 'submit_forms'],
  [UserRole.BREWER]: ['view_public', 'view_internal', 'submit_forms'],
};

// --- Main Settings Component ---

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'users' | 'security' | 'access'>('users');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [rolePermissions, setRolePermissions] = useState(INITIAL_ROLE_PERMISSIONS);
  
  // Security Policies State
  const [policies, setPolicies] = useState([
    { id: "p1", name: "Strict Approval Mode", description: "Require two levels of approval for all RESTRICTED documents.", type: "approval", enabled: true },
    { id: "p2", name: "External Sharing Lock", description: "Prevent sharing of CONFIDENTIAL documents outside the organization.", type: "security", enabled: true },
    { id: "p3", name: "Audit Logging", description: "Log every view and download action for sensitive files.", type: "compliance", enabled: true },
    { id: "p4", name: "Auto-Retention", description: "Automatically archive documents older than 5 years.", type: "retention", enabled: false },
  ]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to remove this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setEditingUser(null);
  };

  const handlePolicyToggle = (id: string) => {
    setPolicies(policies.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };

  const togglePermission = (role: string, permissionId: string) => {
    // Prevent modifying Owner permissions for safety in this demo
    if (role === UserRole.OWNER) return;

    setRolePermissions(prev => {
      const current = prev[role] || [];
      const updated = current.includes(permissionId)
        ? current.filter(id => id !== permissionId)
        : [...current, permissionId];
      return { ...prev, [role]: updated };
    });
  };

  return (
    <div className="space-y-6">
      {editingUser && (
        <EditUserModal 
          user={editingUser} 
          onClose={() => setEditingUser(null)} 
          onSave={handleUpdateUser} 
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">System Settings</h2>
          <p className="text-slate-500 mt-1">Manage users, roles, and system preferences.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation Sidebar */}
        <div className="w-full lg:w-64 flex-none space-y-2">
          <button 
            onClick={() => setActiveTab('general')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
              activeTab === 'general' ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <SettingsIcon size={18} />
            <span>General</span>
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
              activeTab === 'users' ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <Users size={18} />
            <span>Team Members</span>
          </button>
          <button 
            onClick={() => setActiveTab('access')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
              activeTab === 'access' ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <Key size={18} />
            <span>Access Control</span>
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
              activeTab === 'security' ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <Shield size={18} />
            <span>Security & Compliance</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm min-h-[600px] p-6">
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search team members..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center">
                  <Plus size={16} className="mr-2" /> Invite User
                </button>
              </div>

              <div className="overflow-x-auto border border-gray-100 rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Active</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full border border-gray-200 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <RoleBadge role={user.role} />
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center space-x-1.5 text-xs font-medium ${
                            user.status === UserStatus.ACTIVE ? 'text-green-700' : 
                            user.status === UserStatus.INVITED ? 'text-blue-700' : 'text-gray-500'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              user.status === UserStatus.ACTIVE ? 'bg-green-500' : 
                              user.status === UserStatus.INVITED ? 'bg-blue-500' : 'bg-gray-400'
                            }`}></div>
                            <span>{user.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {user.lastActive}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                                onClick={() => setEditingUser(user)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
                                title="Edit Role & Permissions"
                             >
                                <Edit2 size={16} />
                             </button>
                             {user.id !== CURRENT_USER.id && (
                               <button 
                                 onClick={() => handleDeleteUser(user.id)}
                                 className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50"
                               >
                                  <Trash2 size={16} />
                               </button>
                             )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'access' && (
            <div className="space-y-8 animate-in fade-in duration-300">
               <div>
                  <h3 className="text-lg font-bold text-slate-900">Role-Based Access Control</h3>
                  <p className="text-sm text-slate-500">Define what each role can view and perform within the system.</p>
               </div>

               <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                       <tr>
                          <th className="px-6 py-3">Permission / Resource</th>
                          {Object.values(UserRole).map(role => (
                            <th key={role} className="px-6 py-3 text-center">
                              <span className="text-xs uppercase tracking-wider">{role.replace('_', ' ')}</span>
                            </th>
                          ))}
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                       {/* Group permissions by category */}
                       {['Document Access', 'Document Operations', 'Form Operations', 'System Administration'].map(category => (
                         <React.Fragment key={category}>
                            <tr className="bg-gray-50/50">
                               <td colSpan={5} className="px-6 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">{category}</td>
                            </tr>
                            {PERMISSION_ROWS.filter(p => p.category === category).map(permission => (
                               <tr key={permission.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-3 font-medium text-slate-700">{permission.label}</td>
                                  {Object.values(UserRole).map(role => {
                                    const isEnabled = rolePermissions[role]?.includes(permission.id);
                                    const isLocked = role === UserRole.OWNER; 
                                    return (
                                      <td key={role} className="px-6 py-3 text-center">
                                        <button 
                                          onClick={() => togglePermission(role, permission.id)}
                                          disabled={isLocked}
                                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                            isEnabled ? (isLocked ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600') : 'bg-gray-200'
                                          }`}
                                        >
                                          <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
                                        </button>
                                      </td>
                                    );
                                  })}
                               </tr>
                            ))}
                         </React.Fragment>
                       ))}
                    </tbody>
                 </table>
               </div>

               <div className="border-t border-gray-200 pt-8">
                  <div className="flex items-center space-x-2 mb-4">
                     <Briefcase className="text-blue-600" size={24} />
                     <div>
                       <h3 className="text-lg font-bold text-slate-900">Approval Workflow Configuration</h3>
                       <p className="text-sm text-slate-500">Designate approval authorities for sensitive operations.</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                           <h4 className="font-semibold text-slate-900">Document Approval Chain</h4>
                           <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Active</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">Users with these roles can give final approval on RESTRICTED documents.</p>
                        <div className="space-y-2">
                           {[UserRole.COMPLIANCE_OFFICER, UserRole.OWNER].map(role => (
                              <div key={role} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                                 <RoleBadge role={role} />
                                 <Check size={16} className="text-green-600" />
                              </div>
                           ))}
                           <div className="flex items-center justify-between p-2 border border-dashed border-gray-300 rounded text-gray-400 cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-colors">
                              <span className="text-xs font-medium flex items-center"><Plus size={14} className="mr-1" /> Add Role</span>
                           </div>
                        </div>
                     </div>

                     <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                           <h4 className="font-semibold text-slate-900">Form Sign-off Authority</h4>
                           <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Active</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">Designated roles for TTB and regulatory form submission reviews.</p>
                        <div className="space-y-2">
                           <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                               <div className="flex items-center">
                                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold mr-2">1</span>
                                  <span className="text-sm font-medium text-gray-700">Brewery Manager</span>
                               </div>
                               <span className="text-xs text-gray-400">Reviewer</span>
                           </div>
                           <div className="flex justify-center">
                              <div className="h-4 w-px bg-gray-300"></div>
                           </div>
                           <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                               <div className="flex items-center">
                                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold mr-2">2</span>
                                  <span className="text-sm font-medium text-gray-700">Compliance Officer</span>
                               </div>
                               <span className="text-xs text-gray-400">Final Approver</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 space-y-4 py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                 <SettingsIcon size={32} />
              </div>
              <p>General System Settings coming soon.</p>
            </div>
          )}

          {activeTab === 'security' && (
             <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
               <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-900">Governance Policies</h3>
                  <p className="text-sm text-slate-500">Configure how documents are approved, shared, and retained.</p>
               </div>
               
               <div className="space-y-4">
                  {policies.map(p => (
                     <div key={p.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-200 transition-colors">
                        <div className="flex items-start space-x-4">
                           <div className={`p-2 rounded-lg ${p.enabled ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                              {p.type === 'approval' && <FileCheck size={24} />}
                              {p.type === 'security' && <ShieldAlert size={24} />}
                              {p.type === 'compliance' && <Shield size={24} />}
                              {p.type === 'retention' && <Archive size={24} />}
                           </div>
                           <div>
                              <h4 className="font-medium text-slate-900">{p.name}</h4>
                              <p className="text-sm text-slate-500">{p.description}</p>
                           </div>
                        </div>
                        
                        <button 
                          onClick={() => handlePolicyToggle(p.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${p.enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${p.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                     </div>
                  ))}
               </div>

               <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-3">
                  <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="text-sm font-bold text-amber-800">Compliance Note</h4>
                    <p className="text-xs text-amber-700 mt-1">
                      Changing approval policies will not affect documents currently pending review. New rules apply to submissions made after saving.
                    </p>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;