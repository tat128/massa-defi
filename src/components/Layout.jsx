import { Fragment, useState, useEffect, createContext, useContext, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Link, useLocation } from 'react-router-dom'
import {
  Bars3Icon,
  HomeIcon,
  CreditCardIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
  BellIcon,
  UserCircleIcon,
  WalletIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  BoltIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline'
import React from 'react'
import { Dialog as HeadlessDialog } from '@headlessui/react'

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
  { name: 'Payments', href: '/payments', icon: CreditCardIcon },
  { name: 'Transactions', href: '/transactions', icon: ArrowPathIcon },
  { name: 'Security', href: '/security', icon: ShieldCheckIcon },
  { name: 'Gas Optimizer', href: '/gas-optimizer', icon: BoltIcon },
  { name: 'Education', href: '/education', icon: AcademicCapIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
]

// Placeholder wallet info
const wallet = {
  address: '0x1234...abcd',
  balance: '₳ 12,345.67',
  avatar: '', // can use a blockie or icon
}

// Notification context and provider
const NotificationContext = createContext();
export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [showCenter, setShowCenter] = useState(false);
  const idRef = useRef(0);

  const addNotification = (notif) => {
    const id = idRef.current++;
    const notification = { 
      ...notif, 
      id,
      timestamp: new Date(),
      duration: notif.duration || 5000
    };
    setNotifications((prev) => [...prev, notification]);
    setUnread((u) => u + 1);
    setTimeout(() => removeNotification(id), notification.duration);
  };
  
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnread(0);
  };
  
  const openCenter = () => { 
    setShowCenter(true); 
    setUnread(0); 
  };
  
  const closeCenter = () => setShowCenter(false);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
    }
  };

  return (
    <NotificationContext.Provider value={{ addNotification, unread, openCenter }}>
      {children}
      
      {/* Toast Notifications */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-2 max-w-sm">
        {notifications.map((n) => (
          <div 
            key={n.id} 
            className={`notification-toast animate-slide-in ${getNotificationStyles(n.type)} shadow-lg rounded-xl px-4 py-3 flex items-start gap-3 transition-all duration-300`} 
            role="alert" aria-live="assertive"
          >
            <div className="flex-shrink-0 mt-0.5">
              {getNotificationIcon(n.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{n.message}</p>
              {n.description && (
                <p className="text-sm opacity-75 mt-1">{n.description}</p>
              )}
            </div>
            <button
              onClick={() => removeNotification(n.id)}
              className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/60 rounded-full p-1"
              aria-label="Dismiss notification"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Notification Center */}
      {showCenter && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h3>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={closeCenter}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto modern-scrollbar">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <BellIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-300">No notifications yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`flex items-start p-4 rounded-xl border ${getNotificationStyles(n.type)}`}
                    >
                      <div className="flex-shrink-0 mr-3 mt-0.5">
                        {getNotificationIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{n.message}</p>
                        {n.description && (
                          <p className="text-sm opacity-75 mt-1">{n.description}</p>
                        )}
                        <p className="text-xs opacity-60 mt-2">
                          {n.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      <button
                        onClick={() => removeNotification(n.id)}
                        className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

// Token context
const TokenContext = createContext();
export function useTokens() {
  return useContext(TokenContext);
}

export const SUPPORTED_TOKENS = [
  { symbol: 'MAS', name: 'Massa', address: '0x...', decimals: 9 },
  { symbol: 'USDT', name: 'Tether', address: '0x...', decimals: 6 },
  { symbol: 'TEST', name: 'Test Token', address: '0x...', decimals: 18 },
];

export default function Layout({ children }) {
  console.log('Layout component loading...');
  
  // Simple state management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [hideHome, setHideHome] = useState(false);
  
  const location = useLocation();
  const { addNotification } = useNotification();

  // Simple token balances
  const tokenBalances = {};
  const loadingTokens = false;
  const refreshBalances = () => {};

  // Simple effects
  useEffect(() => {
    console.log('Layout mounted successfully');
  }, []);

  useEffect(() => {
    // Check localStorage after mount
    const hideHomeValue = !!localStorage.getItem('massa-hide-home');
    setHideHome(hideHomeValue);
  }, []);

  const toggleDarkMode = () => setDarkMode((d) => !d);

  const connectWallet = async () => {
    setShowConnectModal(true);
  };

  const handleModalConnect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        addNotification({ type: 'success', message: 'Wallet connected!' });
        setShowConnectModal(false);
      } catch (err) {
        addNotification({ type: 'error', message: 'Wallet connection failed', description: err.message });
      }
    } else {
      window.open('https://metamask.io/download/', '_blank');
    }
  };

  return (
    <TokenContext.Provider value={{ SUPPORTED_TOKENS, tokenBalances, loadingTokens, refreshBalances }}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile sidebar */}
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <div className="fixed inset-0 bg-gray-900/80" />
            <div className="fixed inset-0 flex">
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <h1 className="text-2xl font-bold text-white">Massa DeFi</h1>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul className="-mx-2 space-y-1">
                          {navigation.filter(item => item.name !== 'Home' || !hideHome).map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                              <li key={item.name}>
                                <Link
                                  to={item.href}
                                  className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold ${
                                    isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                  }`}
                                >
                                  <item.icon className="h-6 w-6 shrink-0" />
                                  {item.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-80 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-8 pb-4">
            <div className="flex h-20 shrink-0 items-center">
              <h1 className="text-xl font-bold text-white">Massa DeFi</h1>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul className="-mx-2 space-y-1">
                    {navigation.filter(item => item.name !== 'Home' || !hideHome).map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <li key={item.name}>
                          <Link
                            to={item.href}
                            className={`group flex gap-x-3 rounded-xl p-3 text-sm font-semibold ${
                              isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            }`}
                          >
                            <item.icon className="h-6 w-6 shrink-0" />
                            {item.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              </ul>
            </nav>
            <div className="mt-8">
              <button
                onClick={connectWallet}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-700"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-80">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 sm:gap-x-6 sm:px-6 lg:hidden">
            <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex flex-1"></div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button onClick={connectWallet} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold">
                  Connect Wallet
                </button>
                <button type="button" className="-m-2.5 p-2.5 text-gray-400" onClick={toggleDarkMode}>
                  {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          <main className="py-8">
            <div className="px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>

        {/* Connect Wallet Modal */}
        {showConnectModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-xs w-full">
              <h2 className="text-xl font-bold text-white mb-4">Connect Your Wallet</h2>
              {typeof window !== 'undefined' && window.ethereum ? (
                <button
                  onClick={handleModalConnect}
                  className="w-full px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold"
                >
                  Connect with MetaMask
                </button>
              ) : (
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-5 py-3 rounded-xl bg-orange-500 text-white font-semibold text-center block"
                >
                  Install MetaMask
                </a>
              )}
              <button onClick={() => setShowConnectModal(false)} className="mt-4 w-full px-5 py-3 rounded-xl bg-gray-700 text-white">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </TokenContext.Provider>
  );
}