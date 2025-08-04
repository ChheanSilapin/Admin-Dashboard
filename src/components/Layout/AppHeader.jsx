import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  MenuIcon,
  BellIcon,
  SearchIcon,
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  ChevronDownIcon
} from '../../icons';

const AppHeader = () => {
  const { toggleMobileSidebar, toggleSidebar } = useSidebar();
  const { toggleTheme } = useTheme();
  const { currentCurrency, currencies, switchCurrency } = useCurrency();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Check if we're on the Customer page to hide global currency selector
  const isCustomerPage = location.pathname === '/customers';

  // Refs for dropdown management
  const currencyDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target)) {
        setShowCurrencyDropdown(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 flex w-full bg-white border-green-200 z-99999 dark:border-blue-400 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-green-200 dark:border-blue-400 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <button
            className="items-center justify-center w-10 h-10 text-gray-500 border-green-200 rounded-lg z-99999 dark:border-blue-400 lg:flex dark:text-blue-400 lg:h-11 lg:w-11 lg:border"
            onClick={() => {
              if (window.innerWidth >= 1024) {
                toggleSidebar();
              } else {
                toggleMobileSidebar();
              }
            }}
            aria-label="Toggle Sidebar"
          >
            <MenuIcon />
          </button>

          <div className="hidden lg:block">
            <form>
              <div className="relative">
                <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                  <SearchIcon className="dark:text-blue-400" />
                </span>
                <input
                  type="text"
                  placeholder="Search or type command..."
                  className="h-11 w-full rounded-lg border border-green-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-green-500/10 dark:border-blue-400 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                />
                
              </div>
            </form>
          </div>
        </div>

        <div className="flex items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none">
          {/* Currency Selector - Hidden on Customer page */}
          {!isCustomerPage && (
            <div ref={currencyDropdownRef} className="relative">
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="h-10 px-4 py-2 rounded-lg text-sm font-medium shadow-theme-xs bg-white dark:bg-gray-900 border border-green-200 dark:border-blue-400 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-800 focus:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-200 transition-colors duration-200 cursor-pointer flex items-center gap-2"
              >
                <span className="text-green-400 dark:text-blue-400 font-medium">{currencies[currentCurrency]?.symbol || '$'}</span>
                <span>{currentCurrency}</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Currency Dropdown - Fixed positioning */}
              {showCurrencyDropdown && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-gray-900 border border-green-200 dark:border-blue-400 rounded-lg shadow-lg z-50 overflow-hidden">
                  {Object.values(currencies).map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => {
                        switchCurrency(currency.code);
                        setShowCurrencyDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                        currentCurrency === currency.code
                          ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-blue-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 dark:text-blue-400">{currency.symbol}</span>
                        <span>{currency.code}</span>
                      </div>
                      {currentCurrency === currency.code && (
                        <svg className="w-4 h-4 text-green-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 2xsm:gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-green-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-green-50 dark:border-blue-400 dark:bg-gray-900 dark:text-blue-400 dark:hover:bg-green-800 dark:hover:text-white"
            >
              <SunIcon className="hidden dark:block w-5 h-5" />
              <MoonIcon className="block dark:hidden w-5 h-5" />
            </button>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-500 rounded-lg hover:bg-green-50 dark:text-blue-400 dark:hover:bg-green-800">
            <BellIcon />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User menu */}
          <div ref={userDropdownRef} className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="h-10 w-10 rounded-lg text-sm font-medium shadow-theme-xs bg-white dark:bg-gray-900 border border-green-200 dark:border-blue-400 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-800 focus:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-200 transition-colors duration-200 cursor-pointer flex items-center justify-center"
            >
              <UserCircleIcon className="w-5 h-5 text-green-400" />
            </button>

            {/* User Dropdown - Compact mobile design */}
            {showUserDropdown && user && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-green-200 dark:border-blue-400 rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="px-3 py-2 border-b border-green-200 dark:border-blue-400">
                  <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{user.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">{user.role.replace('_', ' ')}</p>
                </div>
                <div>
                  <a href="#" className="block w-full text-left px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-800 transition-colors">
                    Profile
                  </a>
                  <a href="#" className="block w-full text-left px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-800 transition-colors">
                    Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-800 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
