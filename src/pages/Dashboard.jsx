import { useState, useEffect, useRef, useMemo, Suspense, lazy } from 'react';
import { ArrowUpIcon, ArrowDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { CurrencyDollarIcon, ArrowPathIcon, ClockIcon, InformationCircleIcon, PaperAirplaneIcon, ArrowDownTrayIcon, ExclamationCircleIcon, ArrowsRightLeftIcon, ChartBarIcon, WalletIcon, FireIcon, ArrowTrendingUpIcon, BoltIcon, ShieldCheckIcon, Cog6ToothIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import * as QRCode from 'qrcode.react';
// import { useWallet } from '@massalabs/massa-web3';
import { useNotification, useTokens, SUPPORTED_TOKENS } from '../components/Layout';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import WalletError from '../components/WalletError';
import { useDecentralized } from '../App';
import DCATool from '../components/DCATool';
import YieldRouter from '../components/YieldRouter';
import LimitOrderbook from '../components/LimitOrderbook';

const data = [
  { date: '2024-01', amount: 4000 },
  { date: '2024-02', amount: 3000 },
  { date: '2024-03', amount: 5000 },
  { date: '2024-04', amount: 2780 },
  { date: '2024-05', amount: 1890 },
  { date: '2024-06', amount: 2390 },
];

const stats = [
  {
    name: 'Total Balance',
    value: '₳ 24,500.00',
    change: '+4.75%',
    changeType: 'positive',
    icon: CurrencyDollarIcon,
    color: 'from-blue-500 to-purple-600',
  },
  {
    name: 'Active Transactions',
    value: '15',
    change: '+2.02%',
    changeType: 'positive',
    icon: ArrowPathIcon,
    color: 'from-green-500 to-emerald-600',
  },
  {
    name: 'Pending Payments',
    value: '3',
    change: '-0.24%',
    changeType: 'negative',
    icon: ClockIcon,
    color: 'from-orange-500 to-red-600',
  },
];

const recentTransactions = [
  {
    id: 1,
    name: 'Payment to Vendor A',
    amount: '₳ 2,000.00',
    status: 'completed',
    date: '30 mins ago',
    type: 'sent',
  },
  {
    id: 2,
    name: 'Received from Client B',
    amount: '₳ 1,500.00',
    status: 'completed',
    date: '2 hours ago',
    type: 'received',
  },
  {
    id: 3,
    name: 'Smart Contract Deployment',
    amount: '₳ 50.00',
    status: 'pending',
    date: '5 hours ago',
    type: 'contract',
  },
];

// Add mock data for analytics
const priceData = [
  { date: '2024-01', price: 1.2 },
  { date: '2024-02', price: 1.5 },
  { date: '2024-03', price: 1.3 },
  { date: '2024-04', price: 1.7 },
  { date: '2024-05', price: 1.6 },
  { date: '2024-06', price: 1.8 },
];
const portfolioData = [
  { date: '2024-01', value: 10000 },
  { date: '2024-02', value: 12000 },
  { date: '2024-03', value: 11000 },
  { date: '2024-04', value: 14000 },
  { date: '2024-05', value: 13500 },
  { date: '2024-06', value: 15000 },
];
const gasData = [
  { date: '2024-01', gas: 0.02 },
  { date: '2024-02', gas: 0.03 },
  { date: '2024-03', gas: 0.025 },
  { date: '2024-04', gas: 0.018 },
  { date: '2024-05', gas: 0.022 },
  { date: '2024-06', gas: 0.019 },
];

// Helper: mock token prices in USD for portfolio value
const TOKEN_PRICES = {
  MAS: 0.75,
  USDT: 1.0,
  TEST: 0.01,
};

export default function Dashboard() {
  const { decentralizedServices } = useDecentralized();
  const [activeTab, setActiveTab] = useState('overview');
  const [portfolioData, setPortfolioData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'dca', name: 'DCA Tool', icon: ClockIcon },
    { id: 'yield', name: 'Yield Router', icon: ArrowTrendingUpIcon },
    { id: 'trading', name: 'Limit Orders', icon: BoltIcon }
  ];

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      setIsLoading(true);
      
      if (decentralizedServices?.portfolio) {
        // Mock portfolio data - would come from smart contract
        setPortfolioData({
          totalValue: 25000,
          change24h: 5.2,
          change7d: 12.8,
          change30d: -2.1,
          assets: [
            { symbol: 'ETH', amount: 5.2, value: 10400, change: 8.5 },
            { symbol: 'USDC', amount: 8000, value: 8000, change: 0 },
            { symbol: 'LINK', amount: 200, value: 3000, change: 15.2 },
            { symbol: 'UNI', amount: 150, value: 1200, value: 1200, change: -3.1 },
            { symbol: 'AAVE', amount: 20, value: 2400, change: 22.8 }
          ],
          recentTransactions: [
            { type: 'buy', symbol: 'ETH', amount: 0.5, price: 2000, timestamp: Date.now() - 3600000 },
            { type: 'sell', symbol: 'LINK', amount: 50, price: 15, timestamp: Date.now() - 7200000 },
            { type: 'swap', from: 'USDC', to: 'UNI', amount: 500, timestamp: Date.now() - 10800000 }
          ]
        });
      }
    } catch (error) {
      console.error('Failed to load portfolio data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <PortfolioOverview data={portfolioData} />;
      case 'dca':
        return <DCATool />;
      case 'yield':
        return <YieldRouter />;
      case 'trading':
        return <LimitOrderbook />;
      default:
        return <PortfolioOverview data={portfolioData} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {getTabContent()}
      </div>
    </div>
  );
}

// Portfolio Overview Component
const PortfolioOverview = ({ data }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { walletConnected } = useDecentralized();

  const connectWallet = async () => {
    // Dispatch a custom event to trigger the modal in Layout.jsx
    window.dispatchEvent(new CustomEvent('open-connect-wallet-modal'));
  };

  if (!data) {
    return (
      <div className="text-center py-12">
        <WalletIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400 mb-4">Connect your wallet to view portfolio</p>
        {!walletConnected && (
          <button
            onClick={connectWallet}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            Connect Wallet
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <CurrencyDollarIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-gray-400 text-sm">Total Value</div>
              <div className="text-white text-2xl font-bold">${data.totalValue.toLocaleString()}</div>
            </div>
          </div>
          <div className={`text-sm ${data.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {data.change24h >= 0 ? '+' : ''}{data.change24h}% (24h)
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-gray-400 text-sm">7 Day Change</div>
              <div className={`text-white text-2xl font-bold ${data.change7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {data.change7d >= 0 ? '+' : ''}{data.change7d}%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <BoltIcon className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-gray-400 text-sm">Active Orders</div>
              <div className="text-white text-2xl font-bold">12</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <ShieldCheckIcon className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="text-gray-400 text-sm">Yield APY</div>
              <div className="text-white text-2xl font-bold">15.2%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Asset Allocation</h3>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              {showAdvanced ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              {showAdvanced ? 'Hide' : 'Show'} Details
            </button>
          </div>

          <div className="space-y-4">
            {data.assets.map((asset, index) => (
              <div key={asset.symbol} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <span className="text-lg">{getAssetIcon(asset.symbol)}</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{asset.symbol}</div>
                    {showAdvanced && (
                      <div className="text-gray-400 text-sm">{asset.amount} tokens</div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">${asset.value.toLocaleString()}</div>
                  <div className={`text-sm ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.change >= 0 ? '+' : ''}{asset.change}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-6">Recent Transactions</h3>

          <div className="space-y-4">
            {data.recentTransactions.map((tx, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    tx.type === 'buy' ? 'bg-green-500/20' : 
                    tx.type === 'sell' ? 'bg-red-500/20' : 'bg-blue-500/20'
                  }`}>
                    <span className="text-xs font-bold text-white uppercase">{tx.type[0]}</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      {tx.type === 'swap' ? `${tx.from} → ${tx.to}` : `${tx.type} ${tx.symbol}`}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {new Date(tx.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">
                    {tx.type === 'swap' ? `${tx.amount} ${tx.from}` : `${tx.amount} ${tx.symbol}`}
                  </div>
                  {tx.price && (
                    <div className="text-gray-400 text-sm">${tx.price}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2">
          <ClockIcon className="w-5 h-5" />
          Create DCA
        </button>
        
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2">
          <ArrowTrendingUpIcon className="w-5 h-5" />
          Optimize Yield
        </button>
        
        <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2">
          <BoltIcon className="w-5 h-5" />
          Place Order
        </button>
      </div>
    </div>
  );
};

const getAssetIcon = (symbol) => {
  const icons = {
    'ETH': '🔵',
    'USDC': '🔵',
    'LINK': '🔗',
    'UNI': '🦄',
    'AAVE': '🦁'
  };
  return icons[symbol] || '💰';
};