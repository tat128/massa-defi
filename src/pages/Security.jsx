import React, { useState } from 'react';
import { 
  ShieldCheckIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserGroupIcon,
  BugAntIcon,
  LockClosedIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const Security = () => {
  const [activeTab, setActiveTab] = useState('audits');

  // Mock data for security features
  const contractAudits = [
    {
      id: 1,
      contract: 'MassaSwap V1',
      auditor: 'Certik',
      status: 'completed',
      score: 95,
      date: '2024-01-15',
      report: 'https://certik.com/projects/massa-swap',
      findings: 2,
      critical: 0,
      high: 0,
      medium: 1,
      low: 1
    },
    {
      id: 2,
      contract: 'MassaLend V1',
      auditor: 'Trail of Bits',
      status: 'in-progress',
      score: null,
      date: '2024-02-01',
      report: null,
      findings: null,
      critical: null,
      high: null,
      medium: null,
      low: null
    },
    {
      id: 3,
      contract: 'MassaStake V1',
      auditor: 'OpenZeppelin',
      status: 'completed',
      score: 98,
      date: '2024-01-20',
      report: 'https://blog.openzeppelin.com/massa-stake-audit',
      findings: 1,
      critical: 0,
      high: 0,
      medium: 0,
      low: 1
    }
  ];

  const multisigWallets = [
    {
      id: 1,
      name: 'Treasury Multisig',
      address: '0x1234...5678',
      threshold: 3,
      owners: 5,
      balance: '₳ 1,234,567.89',
      lastActivity: '2024-02-01',
      status: 'active'
    },
    {
      id: 2,
      name: 'Emergency Multisig',
      address: '0x8765...4321',
      threshold: 2,
      owners: 3,
      balance: '₳ 500,000.00',
      lastActivity: '2024-01-28',
      status: 'active'
    }
  ];

  const bugBounties = [
    {
      id: 1,
      title: 'Critical Smart Contract Vulnerability',
      reward: '$50,000',
      status: 'open',
      severity: 'critical',
      description: 'Find critical vulnerabilities in core smart contracts'
    },
    {
      id: 2,
      title: 'Frontend Security Issues',
      reward: '$5,000',
      status: 'open',
      severity: 'high',
      description: 'Report frontend security vulnerabilities'
    },
    {
      id: 3,
      title: 'Flash Loan Attack Prevention',
      reward: '$10,000',
      status: 'open',
      severity: 'high',
      description: 'Identify potential flash loan attack vectors'
    }
  ];

  const flashLoanProtection = {
    enabled: true,
    lastCheck: '2024-02-01 14:30:00',
    protectedPools: 15,
    blockedAttempts: 3,
    circuitBreaker: 'active',
    oracleHealth: 'healthy'
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircleIcon className="h-3 w-3 mr-1" />
          Completed
        </span>;
      case 'in-progress':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
          <ClockIcon className="h-3 w-3 mr-1" />
          In Progress
        </span>;
      case 'failed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          <XCircleIcon className="h-3 w-3 mr-1" />
          Failed
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
          Unknown
        </span>;
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          Critical
        </span>;
      case 'high':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
          High
        </span>;
      case 'medium':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
          Medium
        </span>;
      case 'low':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          Low
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
              <h1 className="text-3xl font-bold mb-2">Security Center</h1>
              <p className="text-blue-100">Comprehensive security monitoring and protection</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-3">
                <ShieldCheckIcon className="h-8 w-8 text-green-300" />
              </div>
              <div>
                <p className="text-sm text-blue-100">Security Score</p>
                <p className="text-2xl font-bold">98/100</p>
              </div>
            </div>
          </div>
          
          {/* Security Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-300" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Audited Contracts</p>
                  <p className="text-lg font-bold">{contractAudits.filter(a => a.status === 'completed').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Multisig Wallets</p>
                  <p className="text-lg font-bold">{multisigWallets.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <BugAntIcon className="h-5 w-5 text-purple-300" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Bug Bounties</p>
                  <p className="text-lg font-bold">{bugBounties.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <LockClosedIcon className="h-5 w-5 text-red-300" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Protected Pools</p>
                  <p className="text-lg font-bold">{flashLoanProtection.protectedPools}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('audits')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'audits'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Smart Contract Audits
        </button>
        <button
          onClick={() => setActiveTab('multisig')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'multisig'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Multisig Controls
        </button>
        <button
          onClick={() => setActiveTab('bounties')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'bounties'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Bug Bounties
        </button>
        <button
          onClick={() => setActiveTab('protection')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'protection'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Flash Loan Protection
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'audits' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {contractAudits.map((audit) => (
              <div key={audit.id} className="modern-card p-6 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {audit.contract}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Audited by {audit.auditor}</p>
                  </div>
                  {getStatusBadge(audit.status)}
                </div>
                
                <div className="space-y-3 mb-4">
                  {audit.score && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Security Score</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{audit.score}/100</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Audit Date</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{audit.date}</span>
                  </div>
                  {audit.findings && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Total Findings</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{audit.findings}</span>
                    </div>
                  )}
                </div>

                {audit.findings && (
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">{audit.critical}</div>
                      <div className="text-xs text-gray-500">Critical</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">{audit.high}</div>
                      <div className="text-xs text-gray-500">High</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-600">{audit.medium}</div>
                      <div className="text-xs text-gray-500">Medium</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{audit.low}</div>
                      <div className="text-xs text-gray-500">Low</div>
                    </div>
                  </div>
                )}

                {audit.report && (
                  <a 
                    href={audit.report} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-1" />
                    View Full Report
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'multisig' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {multisigWallets.map((wallet) => (
              <div key={wallet.id} className="modern-card p-6 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {wallet.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{wallet.address}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Active
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Threshold</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{wallet.threshold}/{wallet.owners} signatures</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Balance</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{wallet.balance}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Last Activity</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{wallet.lastActivity}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    Propose Transaction
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'bounties' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bugBounties.map((bounty) => (
              <div key={bounty.id} className="modern-card p-6 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {bounty.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{bounty.description}</p>
                  </div>
                  {getSeverityBadge(bounty.severity)}
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Reward</span>
                    <span className="font-semibold text-green-600">{bounty.reward}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Open
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Submit Report
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    View Guidelines
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'protection' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="modern-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <LockClosedIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Flash Loan Protection</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Real-time monitoring and prevention</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Protected Pools</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{flashLoanProtection.protectedPools}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Blocked Attempts</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{flashLoanProtection.blockedAttempts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Circuit Breaker</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Oracle Health</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Healthy
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Last Check</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{flashLoanProtection.lastCheck}</span>
                </div>
              </div>
            </div>

            <div className="modern-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Protection Analytics</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Real-time security metrics</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Attack Attempts</span>
                    <span className="text-sm text-gray-500">Last 24h</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                  <div className="text-xs text-green-600">↓ 100% from yesterday</div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Protected Value</span>
                    <span className="text-sm text-gray-500">Total</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">₳ 50.2M</div>
                  <div className="text-xs text-green-600">↑ 5.2% from last week</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Security; 