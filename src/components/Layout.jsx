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

// Supported tokens configuration
export const SUPPORTED_TOKENS = [
  {
    symbol: 'MASSA',
    name: 'Massa',
    contractAddress: null,
    decimals: 9,
    isNative: true,
    logo: '⚡',
    color: '#2D5AF6'
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    contractAddress: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    decimals: 8,
    isNative: false,
    logo: '₿',
    color: '#F7931A'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimals: 18,
    isNative: false,
    logo: 'Ξ',
    color: '#627EEA'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    contractAddress: '0xa0b86a33e6441b8c4c8c8c8c8c8c8c8c8c8c8c8c',
    decimals: 6,
    isNative: false,
    logo: '💵',
    color: '#2775CA'
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    decimals: 6,
    isNative: false,
    logo: '💱',
    color: '#26A17B'
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    contractAddress: '0xbb4cdb9cbd36b01bd1cbaef2af88c6b9c8c8c8c8c',
    decimals: 18,
    isNative: false,
    logo: '🟡',
    color: '#F3BA2F'
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    contractAddress: '0x8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c',
    decimals: 9,
    isNative: false,
    logo: '◎',
    color: '#14F195'
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    contractAddress: '0x8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c',
    decimals: 6,
    isNative: false,
    logo: '₳',
    color: '#0033AD'
  },
  {
    symbol: 'DOT',
    name: 'Polkadot',
    contractAddress: '0x8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c',
    decimals: 10,
    isNative: false,
    logo: '●',
    color: '#E6007A'
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    contractAddress: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
    decimals: 18,
    isNative: false,
    logo: '🔷',
    color: '#8247E5'
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    contractAddress: '0x514910771af9ca656af840dff83e8264ecf986ca',
    decimals: 18,
    isNative: false,
    logo: '🔗',
    color: '#2A5ADA'
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    contractAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    decimals: 18,
    isNative: false,
    logo: '🦄',
    color: '#FF007A'
  },
  {
    symbol: 'AAVE',
    name: 'Aave',
    contractAddress: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    decimals: 18,
    isNative: false,
    logo: '👻',
    color: '#B6509E'
  },
  {
    symbol: 'COMP',
    name: 'Compound',
    contractAddress: '0xc00e94cb662c3520282e6f5717214004a7f26888',
    decimals: 18,
    isNative: false,
    logo: '🏦',
    color: '#00D395'
  },
  {
    symbol: 'CRV',
    name: 'Curve DAO Token',
    contractAddress: '0xd533a949740bb3306d119cc777fa900ba034cd52',
    decimals: 18,
    isNative: false,
    logo: '📈',
    color: '#D53394'
  },
  {
    symbol: 'SUSHI',
    name: 'SushiSwap',
    contractAddress: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
    decimals: 18,
    isNative: false,
    logo: '🍣',
    color: '#FA52A0'
  },
  {
    symbol: 'YFI',
    name: 'yearn.finance',
    contractAddress: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad9ec',
    decimals: 18,
    isNative: false,
    logo: '🏛️',
    color: '#006AE3'
  },
  {
    symbol: 'MKR',
    name: 'Maker',
    contractAddress: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
    decimals: 18,
    isNative: false,
    logo: '🏛️',
    color: '#1AAB9B'
  },
  {
    symbol: 'SNX',
    name: 'Synthetix',
    contractAddress: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0f2a6f',
    decimals: 18,
    isNative: false,
    logo: '⚡',
    color: '#00D1FF'
  },
  {
    symbol: 'BAL',
    name: 'Balancer',
    contractAddress: '0xba100000625a3754423978a60c9317c58a424e3d',
    decimals: 18,
    isNative: false,
    logo: '⚖️',
    color: '#1E1E1E'
  },
  {
    symbol: '1INCH',
    name: '1inch',
    contractAddress: '0x111111111117dc0aa78b770fa6a738034120c302',
    decimals: 18,
    isNative: false,
    logo: '1️⃣',
    color: '#000000'
  }
];

// Token context for multi-token support
const TokenContext = createContext();
export function useTokens() {
  return useContext(TokenContext);
}

// Helper to call balanceOf for custom tokens
async function callTokenBalance(provider, contractAddress, userAddress) {
  // This assumes the contract has a 'balanceOf' entrypoint that takes the address as argument and returns a stringified balance
  try {
    const result = await provider.callSmartContract({
      address: contractAddress,
      functionName: 'balanceOf',
      parameter: userAddress,
    });
    // result.returnValue is expected to be a stringified number
    return parseFloat(result.returnValue);
  } catch (e) {
    throw new Error('Failed to fetch token balance');
  }
}

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })
  const location = useLocation()
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Wallet integration
  // const { connect, disconnect, isConnected, account } = useWallet()
  const [tokenBalances, setTokenBalances] = useState({});
  const [loadingTokens, setLoadingTokens] = useState(false);

  const { unread, openCenter } = useNotification();

  // Page transition effect
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Fetch balances logic as before
  const { addNotification } = useNotification();
  const refreshBalances = React.useCallback(() => {
    async function fetchBalances() {
      // if (isConnected && account?.address) {
      //   setLoadingTokens(true);
      //   const balances = {};
      //   let hadError = false;
      //   // Native MAS
      //   // try {
      //   //   const mas = await provider.getAccountBalance(account.address);
      //   //   balances['MAS'] = mas.final / 1e9;
      //   // } catch (e) {
      //   //   balances['MAS'] = null;
      //   //   hadError = true;
      //   // }
      //   // Custom tokens (simulate contract call)
      //   for (const token of SUPPORTED_TOKENS) {
      //     if (!token.isNative) {
      //       try {
      //         const bal = await callTokenBalance(provider, token.contractAddress, account.address);
      //         balances[token.symbol] = bal / Math.pow(10, token.decimals);
      //       } catch (e) {
      //         balances[token.symbol] = null;
      //         hadError = true;
      //         addNotification({ type: 'error', message: `Failed to fetch ${token.symbol} balance.` });
      //       }
      //     }
      //   }
      //   setTokenBalances(balances);
      //   setLoadingTokens(false);
      //   if (hadError) {
      //     addNotification({ type: 'error', message: 'Some balances failed to refresh.' });
      //   } else {
      //     addNotification({ type: 'success', message: 'Balances refreshed!' });
      //   }
      // } else {
      //   setTokenBalances({});
      // }
    }
    fetchBalances();
  }, [addNotification]);

  useEffect(() => {
    refreshBalances();
  }, [refreshBalances]);

  // Effect to update <html> class and localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode((d) => !d)

  // Onboarding modal state
  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('massa-onboarded')) {
      setShowOnboarding(true);
      localStorage.setItem('massa-onboarded', '1');
    }
  }, []);

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  // Top nav links for home page
  const topNavLinks = [
    { name: 'Product', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'Career', href: '#' },
    { name: 'About us', href: '#' },
    { name: 'Contact us', href: '#' },
  ];

  // If on home page, show clean layout with smooth transitions
  if (location.pathname === '/') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 animate-gradient">
        <main className={`page-enter-scale transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          {children}
        </main>
      </div>
    );
  }

  // Connect Wallet logic
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const modalRef = useRef(null);

  const connectWallet = async () => {
    setShowConnectModal(true);
  };

  const handleModalConnect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        addNotification({ type: 'success', message: 'Wallet connected!' });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1200);
        setShowConnectModal(false);
      } catch (err) {
        addNotification({ type: 'error', message: 'Wallet connection failed', description: err.message });
      }
    } else {
      window.open('https://metamask.io/download/', '_blank');
    }
  };

  const [hideHome, setHideHome] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('massa-hide-home');
    }
    return false;
  });

  useEffect(() => {
    const handler = () => setHideHome(!!localStorage.getItem('massa-hide-home'));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // Animate MetaMask icon bounce on modal open
  useEffect(() => {
    if (showConnectModal && modalRef.current) {
      const icon = modalRef.current.querySelector('.metamask-bounce');
      if (icon) {
        icon.classList.remove('animate-bounce-short');
        void icon.offsetWidth; // trigger reflow
        icon.classList.add('animate-bounce-short');
      }
    }
  }, [showConnectModal]);

  // Listen for custom event from Dashboard to open modal
  useEffect(() => {
    const handleOpenModal = () => {
      setShowConnectModal(true);
    };

    window.addEventListener('open-connect-wallet-modal', handleOpenModal);

    return () => {
      window.removeEventListener('open-connect-wallet-modal', handleOpenModal);
    };
  }, []);

  return (
    <TokenContext.Provider value={{ SUPPORTED_TOKENS, tokenBalances, loadingTokens, refreshBalances }}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
                      <h1 className="text-2xl font-bold gradient-text">Massa DeFi</h1>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.filter(item => item.name !== 'Home' || !hideHome).map((item) => {
                              const isActive = location.pathname === item.href
                              return (
                                <li key={item.name}>
                                  <Link
                                    to={item.href}
                                    className={`nav-link group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-200 ${isActive
                                      ? 'bg-gray-800 text-white active'
                                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                      }`}
                                  >
                                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                    {item.name}
                                  </Link>
                                </li>
                              )
                            })}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-80 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-8 pb-4 shadow-2xl border-r border-white/10 sidebar-scrollbar">
            {/* Logo and Brand */}
            <div className="flex h-20 shrink-0 items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover-lift">
                  <WalletIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">Massa DeFi</h1>
                  <p className="text-xs text-gray-400">Decentralized Finance</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.filter(item => item.name !== 'Home' || !hideHome).map((item) => {
                      const isActive = location.pathname === item.href
                      return (
                        <li key={item.name}>
                          <Link
                            to={item.href}
                            className={`nav-link group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold transition-all duration-200 hover:scale-105 ${
                              isActive
                                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30 active'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                            }`}
                          >
                            <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                            {item.name}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              </ul>
            </nav>

            {/* Connect Wallet button at bottom */}
            <div className="mt-8 flex flex-col items-center">
              <button
                onClick={connectWallet}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <WalletIcon className="w-5 h-5" />
                Connect Wallet
              </button>
            </div>
          </div>
        </div>

        {/* Main content area with smooth transitions */}
        <div className="lg:pl-80">
          {/* Mobile header */}
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
            <button type="button" className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex flex-1"></div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button
                  onClick={connectWallet}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Connect Wallet
                </button>
                <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" onClick={toggleDarkMode}>
                  <span className="sr-only">Toggle dark mode</span>
                  {darkMode ? <SunIcon className="h-6 w-6" aria-hidden="true" /> : <MoonIcon className="h-6 w-6" aria-hidden="true" />}
                </button>
              </div>
            </div>
          </div>

          {/* Floating Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/30 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-gray-700 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 group"
            aria-label="Toggle dark mode"
          >
            <span className="sr-only">Toggle dark mode</span>
            {darkMode ? (
              <SunIcon className="h-7 w-7 text-yellow-400 drop-shadow-glow group-hover:scale-110 transition-transform duration-300" />
            ) : (
              <MoonIcon className="h-7 w-7 text-blue-400 drop-shadow-glow group-hover:scale-110 transition-transform duration-300" />
            )}
            {/* Glowing effect */}
            <span className="absolute inset-0 rounded-full pointer-events-none group-hover:ring-4 group-hover:ring-blue-400/30 transition-all duration-300"></span>
          </button>

          {/* Main content with page transition */}
          <main className={`py-8 page-enter transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <div className="px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>

        {/* Custom Connect Wallet Modal */}
        {showConnectModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-500 animate-fade-in">
            <div ref={modalRef} className="bg-gray-900 dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center relative transform transition-all duration-500 animate-modal-in">
              <button onClick={() => setShowConnectModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 transition-transform duration-200 hover:scale-110">
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-6 h-6'><path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' /></svg>
              </button>
              {/* Inline MetaMask SVG icon with bounce */}
              <svg className="w-16 h-16 mb-4 metamask-bounce" viewBox="0 0 318 318" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <polygon fill="#E2761B" points="274,35 174,110 192,70"/>
                  <polygon fill="#E4761B" points="44,35 126,70 144,110"/>
                  <polygon fill="#D7C1B3" points="238,208 206,234 232,256"/>
                  <polygon fill="#D7C1B3" points="86,208 86,256 114,234"/>
                  <polygon fill="#233447" points="132,152 126,170 174,170 168,152 150,152"/>
                  <polygon fill="#CD6116" points="86,208 114,234 110,216"/>
                  <polygon fill="#CD6116" points="232,256 206,234 210,216"/>
                  <polygon fill="#E4761B" points="126,170 110,216 174,170"/>
                  <polygon fill="#E4761B" points="210,216 174,170 206,234"/>
                  <polygon fill="#F6851B" points="174,170 110,216 114,234 174,210 234,234 210,216"/>
                  <polygon fill="#C0AD9E" points="126,70 144,110 150,152 132,152"/>
                  <polygon fill="#C0AD9E" points="192,70 174,110 168,152 186,152"/>
                  <polygon fill="#161616" points="186,152 168,152 174,170 210,216 234,234 174,210 114,234 110,216 126,170 132,152 150,152 168,152"/>
                </g>
              </svg>
              <h2 className="text-xl font-bold text-white mb-2 animate-fade-in">Connect Your Wallet</h2>
              {typeof window !== 'undefined' && window.ethereum ? (
                <>
                  <p className="text-gray-300 mb-6 text-center animate-fade-in">Connect your MetaMask wallet to use Massa DeFi.</p>
                  <button
                    onClick={handleModalConnect}
                    className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 focus:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400/60 relative overflow-hidden group"
                    style={{ position: 'relative' }}
                    onMouseDown={e => {
                      const btn = e.currentTarget;
                      const ripple = document.createElement('span');
                      ripple.className = 'ripple';
                      ripple.style.left = `${e.nativeEvent.offsetX}px`;
                      ripple.style.top = `${e.nativeEvent.offsetY}px`;
                      btn.appendChild(ripple);
                      setTimeout(() => ripple.remove(), 600);
                    }}
                  >
                    Connect with MetaMask
                  </button>
                </>
              ) : (
                <>
                  <p className="text-red-400 mb-4 text-center animate-fade-in">MetaMask not found. Please install MetaMask to connect your wallet.</p>
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold shadow hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 text-center block animate-fade-in"
                  >
                    Install MetaMask
                  </a>
                </>
              )}
              {/* Confetti burst animation */}
              {showConfetti && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <svg className="w-32 h-32 animate-confetti-burst" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="6" fill="#F6851B" />
                    <circle cx="50" cy="20" r="3" fill="#E2761B" />
                    <circle cx="80" cy="50" r="3" fill="#E4761B" />
                    <circle cx="50" cy="80" r="3" fill="#D7C1B3" />
                    <circle cx="20" cy="50" r="3" fill="#CD6116" />
                    <circle cx="30" cy="30" r="2" fill="#F6851B" />
                    <circle cx="70" cy="30" r="2" fill="#E4761B" />
                    <circle cx="70" cy="70" r="2" fill="#C0AD9E" />
                    <circle cx="30" cy="70" r="2" fill="#161616" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Custom scrollbar style for sidebar */}
      <style>{`
        .sidebar-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: transparent rgba(80,90,120,0.18);
        }
        .sidebar-scrollbar::-webkit-scrollbar {
          width: 6px;
          background: transparent;
        }
        .sidebar-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(80,90,120,0.10);
          border-radius: 8px;
          backdrop-filter: blur(2px);
          transition: background 0.2s;
        }
        .sidebar-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(120,130,160,0.22);
        }
      `}</style>

      {/* Animations for modal, icon, confetti, and ripple */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.5s cubic-bezier(.4,0,.2,1); }
        @keyframes modal-in { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
        .animate-modal-in { animation: modal-in 0.5s cubic-bezier(.4,0,.2,1); }
        @keyframes bounce-short { 0% { transform: scale(1); } 30% { transform: scale(1.18) translateY(-8px); } 60% { transform: scale(0.95) translateY(2px); } 100% { transform: scale(1); } }
        .animate-bounce-short { animation: bounce-short 0.7s cubic-bezier(.4,0,.2,1); }
        @keyframes confetti-burst {
          0% { opacity: 0; transform: scale(0.7); }
          20% { opacity: 1; transform: scale(1.1); }
          80% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.2); }
        }
        .animate-confetti-burst { animation: confetti-burst 1.2s cubic-bezier(.4,0,.2,1); }
        .ripple {
          position: absolute;
          width: 120px;
          height: 120px;
          background: rgba(255,255,255,0.18);
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          left: 50%;
          top: 50%;
          animation: ripple-effect 0.6s linear;
        }
        @keyframes ripple-effect {
          0% { opacity: 0.7; transform: scale(0.2); }
          80% { opacity: 0.3; }
          100% { opacity: 0; transform: scale(1.5); }
        }
      `}</style>
    </TokenContext.Provider>
  )
}