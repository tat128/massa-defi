import { useState } from 'react';
import { PlusIcon, CheckCircleIcon, ClockIcon, CalendarIcon, UserIcon, CurrencyDollarIcon } from '@heroicons/react/20/solid';
import { useNotification } from '../components/Layout';
import { QRCodeSVG } from 'qrcode.react';

const payments = [
  {
    id: 1,
    name: 'Monthly Subscription',
    amount: '₳ 500.00',
    recipient: '0x1234...5678',
    dueDate: '2024-02-01',
    status: 'upcoming',
    description: 'Automated payment for service subscription',
    category: 'subscription',
  },
  {
    id: 2,
    name: 'Smart Contract Fee',
    amount: '₳ 100.00',
    recipient: '0x8765...4321',
    dueDate: '2024-02-05',
    status: 'upcoming',
    description: 'Contract deployment and execution fee',
    category: 'contract',
  },
  {
    id: 3,
    name: 'Vendor Payment',
    amount: '₳ 2,500.00',
    recipient: '0x9876...1234',
    dueDate: '2024-01-15',
    status: 'completed',
    description: 'Payment for services rendered',
    category: 'vendor',
  },
  {
    id: 4,
    name: 'Gas Fee Payment',
    amount: '₳ 25.00',
    recipient: '0x5555...6666',
    dueDate: '2024-01-20',
    status: 'completed',
    description: 'Network gas fees for transactions',
    category: 'gas',
  },
];

export default function Payments() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const { addNotification } = useNotification();
  const [showQR, setShowQR] = useState(false);
  const [qrAmount, setQrAmount] = useState('');
  const [qrToken, setQrToken] = useState('MASSA');
  const walletAddress = '0x1234...5678'; // Replace with actual wallet address if available

  const filteredPayments = payments.filter(payment => payment.status === activeTab);

  const handleProcess = (payment) => {
    addNotification({ 
      type: 'success', 
      message: `Payment '${payment.name}' processed successfully!`,
      description: `Amount: ${payment.amount} sent to ${payment.recipient}`
    });
  };

  const getStatusBadge = (status) => {
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircleIcon className="h-3 w-3 mr-1" />
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
        <ClockIcon className="h-3 w-3 mr-1" />
        Upcoming
      </span>
    );
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'subscription':
        return <CalendarIcon className="h-4 w-4" />;
      case 'contract':
        return <CurrencyDollarIcon className="h-4 w-4" />;
      case 'vendor':
        return <UserIcon className="h-4 w-4" />;
      case 'gas':
        return <CurrencyDollarIcon className="h-4 w-4" />;
      default:
        return <CurrencyDollarIcon className="h-4 w-4" />;
    }
  };

  // QR Payment string
  const qrString = `massa:${walletAddress}?amount=${qrAmount || ''}&token=${qrToken || ''}`;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Payments</h1>
              <p className="text-blue-100">Manage your upcoming and completed payments</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-primary bg-white/20 hover:bg-white/30 backdrop-blur-sm" onClick={() => setShowQR(true)}>
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4h4v4H4V4zm0 12h4v4H4v-4zm12-12h4v4h-4V4zm0 12h4v4h-4v-4z" /></svg>
                Pay via QR
              </button>
              <button className="btn-primary bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                <PlusIcon className="h-5 w-5 mr-2" />
                New Payment
              </button>
            </div>
          </div>
          
          {/* Payment Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-yellow-300" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Upcoming</p>
                  <p className="text-lg font-bold">{payments.filter(p => p.status === 'upcoming').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-300" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Completed</p>
                  <p className="text-lg font-bold">{payments.filter(p => p.status === 'completed').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Total Value</p>
                  <p className="text-lg font-bold">₳ 3,125.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'upcoming'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'completed'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Payments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPayments.map((payment) => (
          <div key={payment.id} className="modern-card p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  {getCategoryIcon(payment.category)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {payment.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{payment.category}</p>
                </div>
              </div>
              {getStatusBadge(payment.status)}
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Amount</span>
                <span className="font-semibold text-gray-900 dark:text-white">{payment.amount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Recipient</span>
                <span className="text-sm font-mono text-gray-600 dark:text-gray-300">{payment.recipient}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Due Date</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">{payment.dueDate}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
              {payment.description}
            </p>
            
            <div className="flex gap-2">
              {activeTab === 'upcoming' ? (
                <button
                  onClick={() => handleProcess(payment)}
                  className="flex-1 btn-primary text-sm"
                >
                  Process Payment
                </button>
              ) : (
                <button className="flex-1 btn-secondary text-sm">
                  View Details
                </button>
              )}
              <button className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPayments.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <CurrencyDollarIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No {activeTab} payments
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {activeTab === 'upcoming' 
              ? 'You have no upcoming payments scheduled.'
              : 'You have no completed payments yet.'
            }
          </p>
          <button className="btn-primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            Create New Payment
          </button>
        </div>
      )}

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-xs relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white" onClick={() => setShowQR(false)}>&times;</button>
            <h2 className="text-lg font-bold mb-4 text-center">Pay via QR Code</h2>
            <div className="flex flex-col items-center gap-2">
              <QRCodeSVG value={qrString} size={180} bgColor="#fff" fgColor="#2D5AF6" />
              <div className="w-full mt-4">
                <label className="block text-xs text-gray-500 mb-1">Amount</label>
                <input type="number" min="0" className="w-full rounded-lg border px-2 py-1 mb-2 dark:bg-gray-800 dark:text-white" value={qrAmount} onChange={e => setQrAmount(e.target.value)} placeholder="Enter amount" />
                <label className="block text-xs text-gray-500 mb-1">Token</label>
                <input type="text" className="w-full rounded-lg border px-2 py-1 dark:bg-gray-800 dark:text-white" value={qrToken} onChange={e => setQrToken(e.target.value)} placeholder="Token (e.g. MASSA)" />
              </div>
              <div className="mt-2 text-xs text-center break-all text-gray-500 dark:text-gray-300">{qrString}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}