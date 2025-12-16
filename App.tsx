import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Files, 
  FileText, 
  Database, 
  Search, 
  Bell, 
  Menu,
  ChevronRight,
  ShieldAlert,
  Beer,
  Settings,
  LogOut,
  User,
  Lock,
  FileBarChart
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Forms from './pages/Forms';
import KnowledgeBase from './pages/KnowledgeBase';
import SettingsPage from './pages/Settings';
import Reports from './pages/Reports';
import { CURRENT_USER } from './constants';
import { UserRole } from './types';

const SidebarItem = ({ icon: Icon, label, path, active }: { icon: any, label: string, path: string, active: boolean }) => (
  <Link 
    to={path} 
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  // Role-based visibility
  const canViewSettings = [UserRole.OWNER, UserRole.COMPLIANCE_OFFICER, UserRole.BREWERY_MANAGER].includes(CURRENT_USER.role);
  const canViewAudit = [UserRole.OWNER, UserRole.COMPLIANCE_OFFICER].includes(CURRENT_USER.role);

  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col border-r border-slate-800 z-20">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
        <div className="bg-amber-500 p-2 rounded-lg">
          <Beer className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg tracking-tight">Tripleswitch</h1>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Operating System</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <div className="mb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Operations</div>
        <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/" active={isActive('/')} />
        <SidebarItem icon={Files} label="Documents" path="/documents" active={isActive('/documents')} />
        <SidebarItem icon={FileText} label="Forms Engine" path="/forms" active={isActive('/forms')} />
        <SidebarItem icon={Database} label="Knowledge Base" path="/kb" active={isActive('/kb')} />
        <SidebarItem icon={FileBarChart} label="Reports" path="/reports" active={isActive('/reports')} />
        
        {(canViewSettings || canViewAudit) && (
          <div className="mt-8 mb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">System</div>
        )}
        
        {canViewSettings && (
          <SidebarItem icon={Settings} label="Settings" path="/settings" active={isActive('/settings')} />
        )}
        {canViewAudit && (
          <SidebarItem icon={ShieldAlert} label="Audit Logs" path="/audit" active={isActive('/audit')} />
        )}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
          <img src={CURRENT_USER.avatarUrl} alt="User" className="w-8 h-8 rounded-full border border-slate-600" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{CURRENT_USER.name}</p>
            <p className="text-xs text-slate-400 truncate">{CURRENT_USER.role.replace('_', ' ')}</p>
          </div>
          <LogOut size={16} className="text-slate-400 cursor-pointer hover:text-white" />
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center text-gray-400 text-sm">
        <span className="hover:text-gray-600 cursor-pointer">Tripleswitch</span>
        <ChevronRight size={16} className="mx-2" />
        <span className="font-medium text-gray-900">Dashboard</span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search documents, entities..." 
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
          />
        </div>
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
};

// Protected Route Wrapper
const ProtectedRoute = ({ allowedRoles, children }: { allowedRoles?: UserRole[], children?: React.ReactNode }) => {
  if (allowedRoles && !allowedRoles.includes(CURRENT_USER.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="p-4 bg-red-50 rounded-full mb-4 text-red-600">
          <Lock size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-500 max-w-md">
          You do not have the required permissions ({CURRENT_USER.role.replace('_', ' ')}) to view this page.
        </p>
        <Link to="/" className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Return to Dashboard
        </Link>
      </div>
    );
  }
  return <>{children ? children : <Outlet />}</>;
};

const Layout = ({ children }: { children?: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50">
    <Sidebar />
    <Header />
    <main className="ml-64 pt-16 min-h-screen">
      <div className="p-8 max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  </div>
);

const App = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/forms" element={<Forms />} />
          <Route path="/kb" element={<KnowledgeBase />} />
          <Route path="/reports" element={<Reports />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={[UserRole.OWNER, UserRole.COMPLIANCE_OFFICER, UserRole.BREWERY_MANAGER]} />}>
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={[UserRole.OWNER, UserRole.COMPLIANCE_OFFICER]} />}>
             <Route path="/audit" element={<div>Audit Logs Placeholder</div>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;