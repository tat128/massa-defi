import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, ArrowDownTrayIcon, EyeIcon, FunnelIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';
import { XMarkIcon, DocumentArrowDownIcon, ClockIcon, CheckCircleIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useTokens, useNotification } from '../components/Layout';

const transactions = [
	{
		id: 1,
		type: 'send',
		amount: '1,500.00',
		address: '0x1234...5678',
		timestamp: '2024-01-20 14:30:00',
		status: 'confirmed',
		hash: '0xabcd...efgh',
		fee: '0.25',
		token: 'MAS',
		blockNumber: '1234567',
		confirmations: 12,
		gasUsed: '21000',
		gasPrice: '0.000000001',
	},
	{
		id: 2,
		type: 'receive',
		amount: '2,000.00',
		address: '0x8765...4321',
		timestamp: '2024-01-19 09:15:00',
		status: 'confirmed',
		hash: '0xijkl...mnop',
		fee: '0.25',
		token: 'USDT',
		blockNumber: '1234566',
		confirmations: 45,
		gasUsed: '65000',
		gasPrice: '0.000000001',
	},
	{
		id: 3,
		type: 'contract',
		amount: '500.00',
		address: '0x9876...1234',
		timestamp: '2024-01-18 16:45:00',
		status: 'pending',
		hash: '0xqrst...uvwx',
		fee: '0.30',
		token: 'TEST',
		blockNumber: '1234565',
		confirmations: 0,
		gasUsed: '150000',
		gasPrice: '0.000000002',
	},
	{
		id: 4,
		type: 'send',
		amount: '750.50',
		address: '0x5555...6666',
		timestamp: '2024-01-17 11:20:00',
		status: 'failed',
		hash: '0xaaaa...bbbb',
		fee: '0.25',
		token: 'MAS',
		blockNumber: '1234564',
		confirmations: 0,
		gasUsed: '21000',
		gasPrice: '0.000000001',
	},
	{
		id: 5,
		type: 'receive',
		amount: '3,250.00',
		address: '0x7777...8888',
		timestamp: '2024-01-16 08:45:00',
		status: 'confirmed',
		hash: '0xcccc...dddd',
		fee: '0.25',
		token: 'USDT',
		blockNumber: '1234563',
		confirmations: 89,
		gasUsed: '65000',
		gasPrice: '0.000000001',
	},
];

const statusColors = {
	confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
	pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
	failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const typeColors = {
	send: 'text-red-600 dark:text-red-400',
	receive: 'text-green-600 dark:text-green-400',
	contract: 'text-blue-600 dark:text-blue-400',
};

const typeIcons = {
	send: '↗️',
	receive: '↙️',
	contract: '⚡',
};

const PAGE_SIZE = 10;

export default function Transactions() {
	const [searchTerm, setSearchTerm] = useState('');
	const [loading, setLoading] = useState(false);
	const [selectedTx, setSelectedTx] = useState(null);
	const [filterType, setFilterType] = useState('all');
	const [filterStatus, setFilterStatus] = useState('all');
	const [sortBy, setSortBy] = useState('date-desc');
	const isConnected = false; // Placeholder
	const account = null; // Placeholder
	const provider = null; // Placeholder
	const [txs, setTxs] = useState(transactions);
	const [fetching, setFetching] = useState(false);
	const [fetchError, setFetchError] = useState('');
	const [page, setPage] = useState(1);
	const { SUPPORTED_TOKENS } = useTokens();
	const [filterToken, setFilterToken] = useState('all');
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	const { addNotification } = useNotification();

	useEffect(() => {
		if (isConnected && account?.address && provider) {
			setFetching(true);
			setFetchError('');
			provider
				.getAccountTransactions(account.address)
				.then((fetched) => {
					// Map/format fetched transactions to match UI shape if needed
					setTxs(
						fetched.map((tx, i) => {
							// Assign a random token for demo; replace with real token logic if available
							const token =
								SUPPORTED_TOKENS[
									Math.floor(Math.random() * SUPPORTED_TOKENS.length)
								].symbol;
							return {
								id: tx.id || i,
								type: tx.type || 'send',
								amount: (
									parseFloat(tx.amount) /
									1e9
								).toLocaleString(undefined, {
									maximumFractionDigits: 2,
								}),
								address: tx.recipientAddress || tx.address,
								timestamp: tx.timestamp || tx.time || '',
								status: tx.status || 'confirmed',
								hash: tx.hash,
								fee: tx.fee
									? (
											parseFloat(tx.fee) /
											1e9
									  ).toLocaleString(undefined, {
											maximumFractionDigits: 2,
									  })
									: '0.00',
								token,
							};
						})
					);
				})
				.catch((err) => setFetchError(err.message || 'Failed to fetch transactions'))
				.finally(() => setFetching(false));
		} else {
			setTxs(transactions);
		}
	}, [isConnected, account, provider]);

	// Filtering and sorting
	const filteredTransactions = txs
		.filter(
			(tx) =>
				(filterType === 'all' || tx.type === filterType) &&
				(filterStatus === 'all' || tx.status === filterStatus) &&
				(filterToken === 'all' || tx.token === filterToken) &&
				(tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
					tx.address.toLowerCase().includes(searchTerm.toLowerCase()))
		)
		.sort((a, b) => {
			if (sortBy === 'date-desc')
				return b.timestamp.localeCompare(a.timestamp);
			if (sortBy === 'date-asc') return a.timestamp.localeCompare(b.timestamp);
			if (sortBy === 'amount-desc')
				return (
					parseFloat(b.amount.replace(/[^\d.]/g, '')) -
					parseFloat(a.amount.replace(/[^\d.]/g, ''))
				);
			if (sortBy === 'amount-asc')
				return (
					parseFloat(a.amount.replace(/[^\d.]/g, '')) -
					parseFloat(b.amount.replace(/[^\d.]/g, ''))
				);
			return 0;
		});

	const totalPages = Math.ceil(filteredTransactions.length / PAGE_SIZE) || 1;
	const paginatedTransactions = filteredTransactions.slice(
		(page - 1) * PAGE_SIZE,
		page * PAGE_SIZE
	);

	// Calculate stats
	const stats = {
		total: txs.length,
		confirmed: txs.filter(tx => tx.status === 'confirmed').length,
		pending: txs.filter(tx => tx.status === 'pending').length,
		failed: txs.filter(tx => tx.status === 'failed').length,
		totalValue: txs.reduce((sum, tx) => sum + parseFloat(tx.amount.replace(/[^\d.]/g, '')), 0).toFixed(2)
	};

	const exportTransactions = (format) => {
		const data = filteredTransactions.map(tx => ({
			ID: tx.id,
			Type: tx.type,
			Amount: tx.amount,
			Token: tx.token,
			Address: tx.address,
			Status: tx.status,
			Timestamp: tx.timestamp,
			Hash: tx.hash,
			Fee: tx.fee
		}));

		if (format === 'csv') {
			const headers = Object.keys(data[0]).join(',');
			const rows = data.map(row => Object.values(row).join(','));
			const csv = [headers, ...rows].join('\n');
			const blob = new Blob([csv], { type: 'text/csv' });
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
			a.click();
			window.URL.revokeObjectURL(url);
		} else if (format === 'json') {
			const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `transactions-${new Date().toISOString().split('T')[0]}.json`;
			a.click();
			window.URL.revokeObjectURL(url);
		}

		addNotification({ 
			type: 'success', 
			message: `Transactions exported as ${format.toUpperCase()}`,
			description: `${data.length} transactions downloaded`
		});
	};

	const openTransactionDetails = (tx) => {
		setSelectedTx(tx);
		setShowDetailsModal(true);
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case 'confirmed':
				return <CheckCircleIcon className="h-4 w-4" />;
			case 'pending':
				return <ClockIcon className="h-4 w-4" />;
			case 'failed':
				return <ExclamationTriangleIcon className="h-4 w-4" />;
			default:
				return <ArrowPathIcon className="h-4 w-4" />;
		}
	};

	return (
		<div className="space-y-8">
			{/* Hero Section */}
			<div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
				<div className="absolute inset-0 bg-black/10"></div>
				<div className="relative z-10">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-3xl font-bold mb-2">Transaction History</h1>
							<p className="text-blue-100">Track all your blockchain transactions</p>
						</div>
						<div className="hidden md:flex items-center gap-4">
							<div className="text-right">
								<p className="text-sm text-blue-100">Total Transactions</p>
								<p className="text-2xl font-bold">{stats.total}</p>
							</div>
							<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
								<ArrowPathIcon className="h-8 w-8" />
							</div>
						</div>
					</div>
					
					{/* Transaction Stats */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
									<CheckCircleIcon className="h-5 w-5 text-green-300" />
								</div>
								<div>
									<p className="text-sm text-blue-100">Confirmed</p>
									<p className="text-lg font-bold">{stats.confirmed}</p>
								</div>
							</div>
						</div>
						<div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
									<ClockIcon className="h-5 w-5 text-yellow-300" />
								</div>
								<div>
									<p className="text-sm text-blue-100">Pending</p>
									<p className="text-lg font-bold">{stats.pending}</p>
								</div>
							</div>
						</div>
						<div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
									<ExclamationTriangleIcon className="h-5 w-5 text-red-300" />
								</div>
								<div>
									<p className="text-sm text-blue-100">Failed</p>
									<p className="text-lg font-bold">{stats.failed}</p>
								</div>
							</div>
						</div>
						<div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
									<ArrowDownTrayIcon className="h-5 w-5 text-blue-300" />
								</div>
								<div>
									<p className="text-sm text-blue-100">Total Value</p>
									<p className="text-lg font-bold">₳ {stats.totalValue}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Filters and Search */}
			<div className="modern-card p-6">
				<div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
					<div className="flex-1 max-w-md">
						<div className="relative">
							<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
							<input
								type="text"
								placeholder="Search by hash or address..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="modern-input pl-10"
							/>
						</div>
					</div>
					
					<div className="flex gap-2">
						<select
							value={filterType}
							onChange={(e) => setFilterType(e.target.value)}
							className="modern-input"
						>
							<option value="all">All Types</option>
							<option value="send">Send</option>
							<option value="receive">Receive</option>
							<option value="contract">Contract</option>
						</select>
						
						<select
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}
							className="modern-input"
						>
							<option value="all">All Status</option>
							<option value="confirmed">Confirmed</option>
							<option value="pending">Pending</option>
							<option value="failed">Failed</option>
						</select>
						
						<select
							value={filterToken}
							onChange={(e) => setFilterToken(e.target.value)}
							className="modern-input"
						>
							<option value="all">All Tokens</option>
							{SUPPORTED_TOKENS.map(token => (
								<option key={token.symbol} value={token.symbol}>{token.symbol}</option>
							))}
						</select>
						
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="modern-input"
						>
							<option value="date-desc">Newest First</option>
							<option value="date-asc">Oldest First</option>
							<option value="amount-desc">Highest Amount</option>
							<option value="amount-asc">Lowest Amount</option>
						</select>
					 </div>
				</div>

				<div className="flex items-center justify-between mb-4">
					<p className="text-sm text-gray-600 dark:text-gray-400">
						Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions
					</p>
					<div className="flex gap-2">
						<button
							onClick={() => exportTransactions('csv')}
							className="btn-secondary text-sm"
						>
							<DocumentArrowDownIcon className="h-4 w-4 mr-2" />
							Export CSV
						</button>
						<button
							onClick={() => exportTransactions('json')}
							className="btn-secondary text-sm"
						>
							<DocumentArrowDownIcon className="h-4 w-4 mr-2" />
							Export JSON
						</button>
					</div>
				</div>
			</div>

			{/* Transactions Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{paginatedTransactions.map((tx) => (
					<div key={tx.id} className="modern-card p-6 hover:shadow-xl transition-all duration-300 group">
						<div className="flex items-start justify-between mb-4">
							<div className="flex items-center gap-3">
								<div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
									tx.type === 'send' ? 'bg-red-100 dark:bg-red-900/30' :
									tx.type === 'receive' ? 'bg-green-100 dark:bg-green-900/30' :
									'bg-blue-100 dark:bg-blue-900/30'
								}`}>
									<span className="text-lg">{typeIcons[tx.type]}</span>
								</div>
								<div>
									<h3 className={`font-semibold capitalize ${typeColors[tx.type]}`}>
										{tx.type}
									</h3>
									<p className="text-sm text-gray-500 dark:text-gray-400">{tx.token}</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								{getStatusIcon(tx.status)}
								<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[tx.status]}`}>
									{tx.status}
								</span>
							</div>
						</div>
						
						<div className="space-y-3 mb-4">
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-500 dark:text-gray-400">Amount</span>
								<span className="font-semibold text-gray-900 dark:text-white">₳ {tx.amount}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-500 dark:text-gray-400">Address</span>
								<span className="text-sm font-mono text-gray-600 dark:text-gray-300">{tx.address}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-500 dark:text-gray-400">Fee</span>
								<span className="text-sm text-gray-600 dark:text-gray-300">₳ {tx.fee}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-500 dark:text-gray-400">Date</span>
								<span className="text-sm text-gray-600 dark:text-gray-300">
									{new Date(tx.timestamp).toLocaleDateString()}
								</span>
							</div>
						</div>
						
						<div className="flex gap-2">
							<button
								onClick={() => openTransactionDetails(tx)}
								className="flex-1 btn-primary text-sm"
							>
								<EyeIcon className="h-4 w-4 mr-2" />
								View Details
							</button>
							<button 
								onClick={() => {
									navigator.clipboard.writeText(tx.hash);
									addNotification({ type: 'success', message: 'Transaction hash copied!' });
								}}
								className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
								title="Copy hash"
							>
								<DocumentArrowDownIcon className="h-4 w-4" />
							</button>
						</div>
					</div>
				))}
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-2">
					<button
						onClick={() => setPage(Math.max(1, page - 1))}
						disabled={page === 1}
						className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						<ArrowUpIcon className="h-4 w-4 rotate-90" />
					</button>
					
					<span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
						Page {page} of {totalPages}
					</span>
					
					<button
						onClick={() => setPage(Math.min(totalPages, page + 1))}
						disabled={page === totalPages}
						className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						<ArrowDownIcon className="h-4 w-4 rotate-90" />
					</button>
				</div>
			)}

			{/* Empty State */}
			{filteredTransactions.length === 0 && (
				<div className="text-center py-12">
					<div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
						<ArrowPathIcon className="h-8 w-8 text-gray-400" />
					</div>
					<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
						No transactions found
					</h3>
					<p className="text-gray-500 dark:text-gray-400">
						{searchTerm || filterType !== 'all' || filterStatus !== 'all' || filterToken !== 'all'
							? 'Try adjusting your filters or search terms.'
							: 'You have no transactions yet. Start by sending or receiving tokens.'
						}
					</p>
				</div>
			)}

			{/* Transaction Details Modal */}
			{showDetailsModal && selectedTx && (
				<div className="modal-overlay">
					<div className="modal-content max-w-2xl">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-xl font-bold text-gray-900 dark:text-white">Transaction Details</h3>
							<button
								onClick={() => setShowDetailsModal(false)}
								className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
							>
								<XMarkIcon className="h-6 w-6" />
							</button>
						</div>
						
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transaction Hash</label>
									<p className="text-sm font-mono text-gray-900 dark:text-white break-all">{selectedTx.hash}</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Block Number</label>
									<p className="text-sm text-gray-900 dark:text-white">{selectedTx.blockNumber}</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gas Used</label>
									<p className="text-sm text-gray-900 dark:text-white">{selectedTx.gasUsed}</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gas Price</label>
									<p className="text-sm text-gray-900 dark:text-white">{selectedTx.gasPrice}</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmations</label>
									<p className="text-sm text-gray-900 dark:text-white">{selectedTx.confirmations}</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timestamp</label>
									<p className="text-sm text-gray-900 dark:text-white">{selectedTx.timestamp}</p>
								</div>
							</div>
							
							<div className="flex gap-3 pt-4">
								<button
									onClick={() => {
										navigator.clipboard.writeText(selectedTx.hash);
										addNotification({ type: 'success', message: 'Transaction hash copied!' });
									}}
									className="flex-1 btn-secondary"
								>
									Copy Hash
								</button>
								<button
									onClick={() => setShowDetailsModal(false)}
									className="flex-1 btn-primary"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}