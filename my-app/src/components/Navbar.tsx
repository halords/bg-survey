// src/components/Navbar.tsx
import { FiLogOut, FiPlusCircle, FiSettings, FiHome, FiChevronLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import type { NavbarProps } from '../types';

export default function Navbar({ sidebarOpen, setSidebarOpen, activePage }: NavbarProps) {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', icon: <FiHome />, path: '/dashboard', key: 'dashboard' },
    { name: 'Add Survey', icon: <FiPlusCircle />, path: '/add-survey', key: 'add-survey' },
    { name: 'Configure Survey', icon: <FiSettings />, path: '/configure', key: 'configure' },
  ];

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-indigo-700 text-white transition-all duration-300 flex flex-col h-full relative`}>
      {/* Collapse button positioned at the edge */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`absolute -right-3 top-6 z-10 bg-indigo-700 rounded-full p-1 border-2 border-white shadow-md hover:bg-indigo-600 transition-colors ${
          sidebarOpen ? 'rotate-0' : 'rotate-180'
        }`}
        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {!sidebarOpen ? (
          <FiChevronLeft className="text-white text-lg" />
        ) : (
          <FiChevronLeft className="text-white text-lg" />
        )}
      </button>

      <div className="p-4 flex items-center justify-between border-b border-indigo-600">
        {sidebarOpen && <h1 className="text-xl font-bold">Employee Portal</h1>}
      </div>
      <br />
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <div key={item.key} className="relative group">
            <button
              onClick={() => navigate(item.path)}
              className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                activePage === item.key 
                  ? 'bg-indigo-600' 
                  : 'hover:bg-indigo-600'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="ml-3">{item.name}</span>}
            </button>
            
            {/* Tooltip for collapsed state */}
            {!sidebarOpen && (
              <div className="absolute -m-8 left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                {item.name}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-indigo-600">
        <div className="relative group">
          <button
            onClick={() => {
              localStorage.removeItem('authToken');
              navigate('/');
            }}
            className="flex items-center w-full p-3 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <FiLogOut className="text-xl" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
          
          {!sidebarOpen && (
            <div className="absolute -m-8 left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
              Logout
            </div>
          )}
        </div>
      </div>
    </div>
  );
}