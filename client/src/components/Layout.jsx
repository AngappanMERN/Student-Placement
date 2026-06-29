import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white h-16 border-b border-slate-200 flex items-center justify-between px-4">
          <div className="font-bold text-lg text-primary">HireStream</div>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-slate-100 text-slate-600"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Main Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
