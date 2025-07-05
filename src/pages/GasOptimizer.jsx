import React, { useState } from 'react';
import { 
  CurrencyDollarIcon, 
  ClockIcon, 
  ChartBarIcon,
  ArrowPathIcon,
  BoltIcon,
  GlobeAltIcon,
  CogIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const GasOptimizer = () => {
  const [selectedChain, setSelectedChain] = useState('massa');
  const [gasMode, setGasMode] = useState('auto');

  // Mock data for gas optimization
  const chains = [
    {
      id: 'massa',
      name: 'Massa',
      icon: '⚡',
      gasPrice: '0.001',
      gasLimit: '21000',
      estimatedCost: '₳ 0.021',
      speed: 'fast',
      status: 'active'
    },
    {
      id: 'arbitrum',
      name: 'Arbitrum',
      icon: '🔵',
      gasPrice: '0.1',
      gasLimit: '21000',
      estimatedCost: '$0.0021',
      speed: 'very-fast',
      status: 'active'
    },
    {
      id: 'optimism',
      name: 'Optimism',
      icon: '🟠',
      gasPrice: '0.001',
      gasLimit: '21000',
      estimatedCost: '$0.000021',
      speed: 'very-fast',
      status: 'active'
    },
    {
      id: 'polygon',
      name: 'Polygon',
      icon: '🟣',
      gasPrice: '30',
      gasLimit: '21000',
      estimatedCost: '$0.00063',
      speed: 'fast',
      status: 'active'
    }
  ];

  const gasHistory = [
    { time: '00:00', price: 0.001 },
    { time: '04:00', price: 0.0008 },
    { time: '08:00', price: 0.0012 },
    { time: '12:00', price: 0.0015 },
    { time: '16:00', price: 0.0011 },
    { time: '20:00', price: 0.0009 },
    { time: '24:00', price: 0.001 }
  ];

  const pendingTransactions = [
    {
      id: 1,
      type: 'Swap',
      from: 'MASSA',
      to: 'USDC',
      amount: '100',
      gasPrice: '0.001',
      estimatedCost: '₳ 0.021',
      status: 'pending'
    },
    {
      id: 2,
      type: 'Stake',
      token: 'MASSA',
      amount: '500',
      gasPrice: '0.001',
      estimatedCost: '₳ 0.021',
      status: 'pending'
    }
  ];

  const getSpeedBadge = (speed) => {
    switch (speed) {
      case 'very-fast':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <BoltIcon className="h-3 w-3 mr-1" />
          Very Fast
        </span>;
      case 'fast':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          <ArrowPathIcon className="h-3 w-3 mr-1" />
          Fast
        </span>;
      case 'medium':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
          <ClockIcon className="h-3 w-3 mr-1" />
          Medium
        </span>;
      case 'slow':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          <ClockIcon className="h-3 w-3 mr-1" />
          Slow
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
          Unknown
        </span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gas Optimizer</h1>
              <p className="text-blue-100">Optimize gas fees across multiple chains</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-3">
                <BoltIcon className="h-8 w-8 text-green-300" />
              </div>
              <div>
                <p className="text-sm text-blue-100">Total Savings</p>
                <p className="text-2xl font-bold">₳ 1,234.56</p>
              </div>
            </div>
          </div>
          
          {/* Gas Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Current Gas</p>
                  <p className="text-lg font-bold">₳ 0.001</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-green-300" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Best Time</p>
                  <p className="text-lg font-bold">02:00 AM</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <GlobeAltIcon className="h-5 w-5 text-purple-300" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Supported Chains</p>
                  <p className="text-lg font-bold">{chains.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-5 w-5 text-yellow-300" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Pending TXs</p>
                  <p className="text-lg font-bold">{pendingTransactions.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gas Mode Selector */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        <button
          onClick={() => setGasMode('auto')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            gasMode === 'auto'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <BoltIcon className="h-4 w-4 inline mr-2" />
          Auto Optimize
        </button>
        <button
          onClick={() => setGasMode('manual')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            gasMode === 'manual'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <CogIcon className="h-4 w-4 inline mr-2" />
          Manual Control
        </button>
        <button
          onClick={() => setGasMode('scheduled')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            gasMode === 'scheduled'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <ClockIcon className="h-4 w-4 inline mr-2" />
          Scheduled
        </button>
      </div>

      {/* Multi-Chain Gas Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chain Comparison */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Multi-Chain Gas Comparison</h2>
          <div className="space-y-4">
            {chains.map((chain) => (
              <div 
                key={chain.id}
                className={`modern-card p-4 cursor-pointer transition-all duration-200 ${
                  selectedChain === chain.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedChain(chain.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{chain.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{chain.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {chain.gasPrice} gwei
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {chain.estimatedCost}
                    </div>
                    {getSpeedBadge(chain.speed)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gas History Chart */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gas Price History (24h)</h2>
          <div className="modern-card p-6">
            <div className="h-64 flex items-end justify-between gap-1">
              {gasHistory.map((point, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-8 bg-gradient-to-t from-blue-600 to-purple-600 rounded-t"
                    style={{ height: `${(point.price / 0.002) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">{point.time}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">Current: ₳ {gasHistory[gasHistory.length - 1].price}</p>
              <p className="text-xs text-green-600">↓ 10% from peak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Transactions */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pending Transactions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pendingTransactions.map((tx) => (
            <div key={tx.id} className="modern-card p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{tx.type}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {tx.type === 'Swap' ? `${tx.amount} ${tx.from} → ${tx.to}` : `${tx.amount} ${tx.token}`}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  Pending
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Gas Price</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{tx.gasPrice} gwei</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Estimated Cost</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{tx.estimatedCost}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Speed Up
                </button>
                <button className="flex-1 px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gas Optimization Tips */}
      <div className="modern-card p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Gas Optimization Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Batch Transactions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Combine multiple operations into a single transaction to save gas
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <InformationCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Use L2 Networks</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Arbitrum and Optimism offer 10-100x lower gas fees
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <InformationCircleIcon className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Time Your Transactions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gas prices are typically lowest during off-peak hours
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <InformationCircleIcon className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Account Abstraction</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pay gas fees in stablecoins or app tokens instead of native tokens
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GasOptimizer; 