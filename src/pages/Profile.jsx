import { useState } from 'react';
import { useTokens, useNotification } from '../components/Layout';
import { UserCircleIcon, CameraIcon, PencilIcon, ShieldCheckIcon, WalletIcon, ChartBarIcon, CogIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, StarIcon } from '@heroicons/react/20/solid';

export default function Profile() {
  const { SUPPORTED_TOKENS, tokenBalances } = useTokens();
  const { addNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [bio, setBio] = useState('DeFi enthusiast and early Massa adopter');
  
  const walletAddress = '0x1234...abcd'; // Placeholder
  const joinDate = 'January 2024';
  const totalTransactions = 47;
  const totalValue = '₳ 24,500.00';

  const profileStats = [
    {
      name: 'Total Balance',
      value: totalValue,
      icon: WalletIcon,
      color: 'from-blue-500 to-purple-600'
    },
    {
      name: 'Transactions',
      value: totalTransactions.toString(),
      icon: ChartBarIcon,
      color: 'from-green-500 to-emerald-600'
    },
    {
      name: 'Member Since',
      value: joinDate,
      icon: StarIcon,
      color: 'from-purple-500 to-blue-600'
    }
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    addNotification({ 
      type: 'success', 
      message: 'Profile updated successfully!',
      description: 'Your profile information has been saved.'
    });
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <UserCircleIcon className="h-16 w-16 text-white" />
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors">
                  <CameraIcon className="h-4 w-4 text-white" />
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
                <p className="text-blue-100 mb-3">{bio}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1">
                    <ShieldCheckIcon className="h-4 w-4" />
                    <span className="text-sm">Verified User</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1">
                    <StarIcon className="h-4 w-4" />
                    <span className="text-sm">Early Adopter</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2 transition-colors"
            >
              <PencilIcon className="h-4 w-4" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
          
          {/* Profile Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profileStats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-100">{stat.name}</p>
                    <p className="text-lg font-bold">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Info */}
        <div className="lg:col-span-2">
          <div className="modern-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <UserCircleIcon className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="modern-input"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium">{displayName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="modern-input"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="modern-input"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{bio}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Wallet Address</label>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2 select-all">
                    {walletAddress}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(walletAddress);
                      addNotification({ type: 'success', message: 'Address copied!' });
                    }}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
              
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveProfile}
                    className="btn-primary"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Token Balances */}
        <div className="modern-card p-6 lg:sticky lg:top-8 max-h-[480px] overflow-y-auto scrollbar-none token-scrollbar">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <WalletIcon className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Token Balances</h2>
          </div>
          <div className="flex flex-col gap-2">
            {SUPPORTED_TOKENS.map(token => (
              <div key={token.symbol} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-blue-50/50 dark:hover:bg-blue-900/30 transition group">
                <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {token.icon ? (typeof token.icon === 'string' && token.icon.startsWith('/') ? 
                      <img src={token.icon} alt={token.symbol} className="w-5 h-5" /> : 
                      token.icon) : token.symbol.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">{token.symbol}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{token.name}</span>
                  </div>
                  <div className="relative group">
                    <span
                      className="block font-mono text-xs text-gray-700 dark:text-gray-300 max-w-[120px] truncate cursor-pointer group-hover:underline"
                      title={tokenBalances[token.symbol] !== undefined && tokenBalances[token.symbol] !== null 
                        ? tokenBalances[token.symbol].toLocaleString(undefined, { maximumFractionDigits: token.decimals })
                        : '--'}
                    >
                      {tokenBalances[token.symbol] !== undefined && tokenBalances[token.symbol] !== null 
                        ? tokenBalances[token.symbol].toLocaleString(undefined, { maximumFractionDigits: token.decimals })
                        : '--'}
                    </span>
                  </div>
                </div>
                <div className="text-right min-w-[80px]">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">
                    ≈ ₳ {((tokenBalances[token.symbol] || 0) * 0.75).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="modern-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <ChartBarIcon className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Activity Summary</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">47</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Transactions</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">42</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Successful</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">3</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">2</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Failed</p>
          </div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <CogIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          More Features Coming Soon
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          We're working on adding more profile features like transaction history, 
          portfolio analytics, and social features. Stay tuned!
        </p>
      </div>

      {/* Custom scrollbar style for token balances */}
      <style>{`
        .token-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: transparent rgba(80,90,120,0.18);
        }
        .token-scrollbar::-webkit-scrollbar {
          width: 4px;
          background: transparent;
        }
        .token-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .token-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(80,90,120,0.10);
          border-radius: 8px;
          backdrop-filter: blur(2px);
          transition: background 0.2s;
        }
        .token-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(120,130,160,0.22);
        }
      `}</style>
    </div>
  );
} 