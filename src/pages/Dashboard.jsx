import { useState, useEffect } from 'react';
import { CurrencyDollarIcon, ArrowPathIcon, ClockIcon, ChartBarIcon, WalletIcon, ArrowTrendingUpIcon, BoltIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  console.log('=== DASHBOARD COMPONENT LOADING ===');
  
  // Simple test to see if component loads
  useEffect(() => {
    console.log('Dashboard mounted successfully!');
    document.title = 'Massa DeFi - Dashboard';
  }, []);

  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'dca', name: 'DCA Tool', icon: ClockIcon },
    { id: 'yield', name: 'Yield Router', icon: ArrowTrendingUpIcon },
    { id: 'trading', name: 'Limit Orders', icon: BoltIcon }
  ];

  useEffect(() => {
    console.log('Dashboard useEffect triggered');
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      console.log('Loading completed');
    }, 1000);
  }, []);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Wallet connected!');
      } else {
        console.log('MetaMask not found');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Balance</p>
                    <p className="text-2xl font-bold text-white">₳ 24,500.00</p>
                    <p className="text-green-400 text-sm">+4.75%</p>
                  </div>
                  <CurrencyDollarIcon className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Transactions</p>
                    <p className="text-2xl font-bold text-white">15</p>
                    <p className="text-green-400 text-sm">+2.02%</p>
                  </div>
                  <ArrowPathIcon className="w-8 h-8 text-green-400" />
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Pending Payments</p>
                    <p className="text-2xl font-bold text-white">3</p>
                    <p className="text-red-400 text-sm">-0.24%</p>
                  </div>
                  <ClockIcon className="w-8 h-8 text-orange-400" />
                </div>
              </div>
            </div>

            {/* Connect Wallet Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
              <WalletIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
              <p className="text-gray-400 mb-4">Connect your wallet to start using DeFi features</p>
              <button
                onClick={connectWallet}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Connect Wallet
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-white font-medium">Payment to Vendor A</p>
                    <p className="text-gray-400 text-sm">30 mins ago</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">₳ 2,000.00</p>
                    <p className="text-green-400 text-sm">Completed</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-white font-medium">Received from Client B</p>
                    <p className="text-gray-400 text-sm">2 hours ago</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">₳ 1,500.00</p>
                    <p className="text-green-400 text-sm">Completed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'dca':
        return (
          <div className="text-center py-12">
            <ClockIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">DCA Tool</h3>
            <p className="text-gray-400">Automated Dollar Cost Averaging - Coming Soon!</p>
          </div>
        );
      case 'yield':
        return (
          <div className="text-center py-12">
            <ArrowTrendingUpIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Yield Router</h3>
            <p className="text-gray-400">Optimize your yields across protocols - Coming Soon!</p>
          </div>
        );
      case 'trading':
        return (
          <div className="text-center py-12">
            <BoltIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Limit Orders</h3>
            <p className="text-gray-400">Advanced trading with limit orders - Coming Soon!</p>
          </div>
        );
      default:
        return <div className="text-white">Select a tab</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mb-4"></div>
          <div className="text-white text-lg">Loading Dashboard...</div>
          <div className="text-gray-400 text-sm mt-2">Please wait...</div>
        </div>
      </div>
    );
  }

  console.log('Rendering main dashboard content');
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">DeFi Dashboard</h1>
        <p className="text-xl text-gray-400">
          Advanced DeFi primitives with autonomous smart contracts
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-2 border border-white/10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
        {getTabContent()}
      </div>
    </div>
  );
}