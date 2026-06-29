import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, FileText, UserCircle, MessageSquare, Users, BarChart3, LogOut, Code, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const studentLinks = [
    { name: 'Explore Jobs', path: '/jobs', icon: <Briefcase size={20} /> },
    { name: 'My Applications', path: '/applications', icon: <FileText size={20} /> },
    { name: 'My Profile', path: '/profile', icon: <UserCircle size={20} /> },
    { name: 'AI Mock Interview', path: '/mock-interview', icon: <MessageSquare size={20} /> },
  ];

  const adminLinks = [
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} /> },
    { name: 'Applicants', path: '/admin/applicants', icon: <Users size={20} /> },
    { name: 'Manage Jobs', path: '/admin/jobs', icon: <Code size={20} /> },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar sidebar bg-white border-r */}
      <aside className={`fixed lg:static inset-y-0 left-0 bg-white border-r border-slate-200 w-64 z-30 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Briefcase className="text-primary mr-2" size={24} />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">
            HireStream
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          {links.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => { if(window.innerWidth < 1024) toggleSidebar() }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute left-0 w-1 h-8 bg-primary rounded-r-md" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
                <span className={`${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`}>
                  {link.icon}
                </span>
                {link.name}
              </NavLink>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-slate-50">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-danger hover:border-danger/30 transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
