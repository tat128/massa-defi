import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { CheckCircleIcon, UserIcon, CogIcon, ShieldCheckIcon, BellIcon, CreditCardIcon, MoonIcon, SunIcon } from '@heroicons/react/20/solid';
import { saveAs } from "file-saver";
import { useNotification } from '../components/Layout';

// const { isConnected, account } = useWallet();
// const { provider } = useProvider();

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [autoPayments, setAutoPayments] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false;
  });
  const [walletAddress, setWalletAddress] = useState('');
  const [savedAddress, setSavedAddress] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [currency, setCurrency] = useState('MAS');
  const { addNotification } = useNotification();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleWalletSubmit = (e) => {
    e.preventDefault();
    setSavedAddress(walletAddress);
    addNotification({ 
      type: 'success', 
      message: 'Wallet address saved successfully!',
      description: 'Your wallet is now connected to the application.'
    });
  };

  const handlePrefSave = (setting, value) => {
    addNotification({ 
      type: 'success', 
      message: `${setting} updated!`,
      description: `Your ${setting.toLowerCase()} preference has been saved.`
    });
  };

  function handleProfileSave(e) {
    e.preventDefault();
    addNotification({ 
      type: 'success', 
      message: 'Profile updated successfully!',
      description: 'Your profile information has been saved.'
    });
  }

  const settingsSections = [
    {
      title: 'Profile Settings',
      icon: UserIcon,
      color: 'from-blue-500 to-purple-600',
      items: [
        {
          name: 'Display Name',
          type: 'input',
          value: displayName,
          onChange: setDisplayName,
          placeholder: 'Enter your display name'
        },
        {
          name: 'Email Address',
          type: 'input',
          value: email,
          onChange: setEmail,
          placeholder: 'Enter your email address'
        },
        {
          name: 'Preferred Currency',
          type: 'select',
          value: currency,
          onChange: setCurrency,
          options: ['MAS', 'USD', 'EUR', 'BTC']
        }
      ]
    },
    {
      title: 'Wallet Configuration',
      icon: ShieldCheckIcon,
      color: 'from-green-500 to-emerald-600',
      items: [
        {
          name: 'Wallet Address',
          type: 'input',
          value: walletAddress,
          onChange: setWalletAddress,
          placeholder: 'Enter your wallet address'
        }
      ]
    },
    {
      title: 'Preferences',
      icon: CogIcon,
      color: 'from-purple-500 to-blue-600',
      items: [
        {
          name: 'Enable Notifications',
          type: 'switch',
          value: notifications,
          onChange: (value) => {
            setNotifications(value);
            handlePrefSave('Notifications', value);
          },
          description: 'Receive alerts for transactions and payments'
        },
        {
          name: 'Automatic Payments',
          type: 'switch',
          value: autoPayments,
          onChange: (value) => {
            setAutoPayments(value);
            handlePrefSave('Automatic payments', value);
          },
          description: 'Process scheduled payments automatically'
        },
        {
          name: 'Dark Mode',
          type: 'switch',
          value: darkMode,
          onChange: setDarkMode,
          description: 'Switch between light and dark theme'
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Settings</h1>
              <p className="text-blue-100">Customize your Massa DeFi experience</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <CogIcon className="h-8 w-8" />
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <ShieldCheckIcon className="h-5 w-5 text-green-300" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Wallet Status</p>
                  <p className="text-lg font-bold">{savedAddress ? 'Connected' : 'Not Connected'}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <BellIcon className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Notifications</p>
                  <p className="text-lg font-bold">{notifications ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  {darkMode ? <MoonIcon className="h-5 w-5 text-purple-300" /> : <SunIcon className="h-5 w-5 text-purple-300" />}
                </div>
                <div>
                  <p className="text-sm text-blue-100">Theme</p>
                  <p className="text-lg font-bold">{darkMode ? 'Dark' : 'Light'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="modern-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 bg-gradient-to-r ${section.color} rounded-lg flex items-center justify-center`}>
                <section.icon className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{section.title}</h2>
            </div>
            
            <div className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                    {item.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    {item.type === 'input' && (
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => item.onChange(e.target.value)}
                        placeholder={item.placeholder}
                        className="modern-input w-64"
                      />
                    )}
                    
                    {item.type === 'select' && (
                      <select
                        value={item.value}
                        onChange={(e) => item.onChange(e.target.value)}
                        className="modern-input w-32"
                      >
                        {item.options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                    
                    {item.type === 'switch' && (
                      <Switch
                        checked={item.value}
                        onChange={item.onChange}
                        className={classNames(
                          item.value ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200 dark:bg-gray-700',
                          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                        )}
                      >
                        <span className="sr-only">Enable {item.name.toLowerCase()}</span>
                        <span
                          aria-hidden="true"
                          className={classNames(
                            item.value ? 'translate-x-5' : 'translate-x-0',
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                          )}
                        />
                      </Switch>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {section.title === 'Wallet Configuration' && (
              <div className="mt-4">
                <button
                  onClick={handleWalletSubmit}
                  className="btn-primary"
                >
                  Save Wallet Address
                </button>
                {savedAddress && (
                  <div className="mt-3 flex items-center text-sm text-green-600 dark:text-green-400">
                    <CheckCircleIcon className="mr-1.5 h-5 w-5 flex-shrink-0" />
                    Wallet connected successfully
                  </div>
                )}
              </div>
            )}
            
            {section.title === 'Profile Settings' && (
              <div className="mt-4">
                <button
                  onClick={handleProfileSave}
                  className="btn-primary"
                >
                  Save Profile
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Export Data Section */}
      <div className="modern-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <CreditCardIcon className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Data Management</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              const data = {
                profile: { displayName, email, currency },
                preferences: { notifications, autoPayments, darkMode },
                wallet: { address: savedAddress }
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              saveAs(blob, `massa-defi-settings-${new Date().toISOString().split('T')[0]}.json`);
              addNotification({ type: 'success', message: 'Settings exported successfully!' });
            }}
            className="btn-secondary"
          >
            Export Settings
          </button>
          
          <button
            onClick={() => {
              addNotification({ 
                type: 'warning', 
                message: 'Reset functionality coming soon!',
                description: 'This feature will be available in the next update.'
              });
            }}
            className="btn-secondary bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
          >
            Reset All Settings
          </button>
        </div>
      </div>
    </div>
  );
}