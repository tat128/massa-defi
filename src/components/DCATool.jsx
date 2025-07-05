import { useState, useEffect } from 'react'
import { 
  CalendarIcon, 
  CurrencyDollarIcon, 
  ArrowPathIcon,
  PlayIcon,
  PauseIcon,
  TrashIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { useDecentralized } from '../App'

const DCATool = () => {
  const { decentralizedServices } = useDecentralized()
  const [dcaOrders, setDcaOrders] = useState([])
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    tokenIn: '',
    tokenOut: '',
    amount: '',
    frequency: '86400', // 24 hours default
    startDate: new Date().toISOString().split('T')[0]
  })

  const frequencyOptions = [
    { value: '3600', label: 'Every Hour', description: '1 hour intervals' },
    { value: '86400', label: 'Daily', description: '24 hour intervals' },
    { value: '604800', label: 'Weekly', description: '7 day intervals' },
    { value: '2592000', label: 'Monthly', description: '30 day intervals' }
  ]

  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', address: '0x...', icon: '🔵' },
    { symbol: 'USDC', name: 'USD Coin', address: '0x...', icon: '🔵' },
    { symbol: 'USDT', name: 'Tether', address: '0x...', icon: '🔵' },
    { symbol: 'LINK', name: 'Chainlink', address: '0x...', icon: '🔗' },
    { symbol: 'UNI', name: 'Uniswap', address: '0x...', icon: '🦄' }
  ]

  useEffect(() => {
    loadDCAOrders()
  }, [])

  const loadDCAOrders = async () => {
    try {
      // Load user's DCA orders from smart contract
      if (decentralizedServices?.portfolio) {
        const userAddress = await decentralizedServices.portfolio.getUserAddress()
        // Mock data for now - would come from smart contract
        setDcaOrders([
          {
            id: 1,
            tokenIn: 'USDC',
            tokenOut: 'ETH',
            amount: '100',
            frequency: '86400',
            totalExecutions: 15,
            totalAmountIn: '1500',
            totalAmountOut: '0.75',
            isActive: true,
            lastExecution: Date.now() - 86400000
          },
          {
            id: 2,
            tokenIn: 'USDT',
            tokenOut: 'LINK',
            amount: '50',
            frequency: '604800',
            totalExecutions: 8,
            totalAmountIn: '400',
            totalAmountOut: '12.5',
            isActive: false,
            lastExecution: Date.now() - 604800000
          }
        ])
      }
    } catch (error) {
      console.error('Failed to load DCA orders:', error)
    }
  }

  const createDCA = async () => {
    try {
      setIsCreating(true)
      
      // Create DCA order on smart contract
      if (decentralizedServices?.portfolio) {
        // Mock creation - would call smart contract
        const newDCA = {
          id: dcaOrders.length + 1,
          ...formData,
          totalExecutions: 0,
          totalAmountIn: '0',
          totalAmountOut: '0',
          isActive: true,
          lastExecution: Date.now()
        }
        
        setDcaOrders([...dcaOrders, newDCA])
        setFormData({
          tokenIn: '',
          tokenOut: '',
          amount: '',
          frequency: '86400',
          startDate: new Date().toISOString().split('T')[0]
        })
      }
    } catch (error) {
      console.error('Failed to create DCA:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const toggleDCA = async (dcaId, isActive) => {
    try {
      // Toggle DCA status on smart contract
      setDcaOrders(orders => 
        orders.map(order => 
          order.id === dcaId ? { ...order, isActive: !isActive } : order
        )
      )
    } catch (error) {
      console.error('Failed to toggle DCA:', error)
    }
  }

  const deleteDCA = async (dcaId) => {
    try {
      // Cancel DCA on smart contract
      setDcaOrders(orders => orders.filter(order => order.id !== dcaId))
    } catch (error) {
      console.error('Failed to delete DCA:', error)
    }
  }

  const getNextExecution = (lastExecution, frequency) => {
    const next = new Date(lastExecution + parseInt(frequency) * 1000)
    return next.toLocaleString()
  }

  const getFrequencyLabel = (frequency) => {
    const option = frequencyOptions.find(opt => opt.value === frequency)
    return option ? option.label : 'Custom'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">DCA Tool</h2>
        <p className="text-gray-400">
          Automate your crypto purchases with Dollar Cost Averaging
        </p>
      </div>

      {/* Create New DCA */}
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4">Create New DCA</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Token In */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              From Token
            </label>
            <select
              value={formData.tokenIn}
              onChange={(e) => setFormData({...formData, tokenIn: e.target.value})}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select token</option>
              {tokens.map(token => (
                <option key={token.symbol} value={token.symbol}>
                  {token.icon} {token.symbol}
                </option>
              ))}
            </select>
          </div>

          {/* Token Out */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              To Token
            </label>
            <select
              value={formData.tokenOut}
              onChange={(e) => setFormData({...formData, tokenOut: e.target.value})}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select token</option>
              {tokens.map(token => (
                <option key={token.symbol} value={token.symbol}>
                  {token.icon} {token.symbol}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="100"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Frequency
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({...formData, frequency: e.target.value})}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {frequencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={createDCA}
          disabled={isCreating || !formData.tokenIn || !formData.tokenOut || !formData.amount}
          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isCreating ? (
            <>
              <ArrowPathIcon className="w-5 h-5 animate-spin" />
              Creating DCA...
            </>
          ) : (
            <>
              <CalendarIcon className="w-5 h-5" />
              Create DCA Order
            </>
          )}
        </button>
      </div>

      {/* Active DCA Orders */}
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-4">Your DCA Orders</h3>
        
        {dcaOrders.length === 0 ? (
          <div className="text-center py-8">
            <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No DCA orders yet. Create your first one above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {dcaOrders.map((dca) => (
              <div key={dca.id} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{tokens.find(t => t.symbol === dca.tokenIn)?.icon}</span>
                      <span className="text-white font-semibold">{dca.amount} {dca.tokenIn}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-lg">{tokens.find(t => t.symbol === dca.tokenOut)?.icon}</span>
                      <span className="text-white font-semibold">{dca.tokenOut}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <CalendarIcon className="w-4 h-4" />
                      {getFrequencyLabel(dca.frequency)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      dca.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {dca.isActive ? 'Active' : 'Paused'}
                    </div>
                    
                    <button
                      onClick={() => toggleDCA(dca.id, dca.isActive)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      {dca.isActive ? (
                        <PauseIcon className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <PlayIcon className="w-4 h-4 text-green-400" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => deleteDCA(dca.id)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Total Executions</div>
                    <div className="text-white font-semibold">{dca.totalExecutions}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Total Invested</div>
                    <div className="text-white font-semibold">{dca.totalAmountIn} {dca.tokenIn}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Total Received</div>
                    <div className="text-white font-semibold">{dca.totalAmountOut} {dca.tokenOut}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Next Execution</div>
                    <div className="text-white font-semibold">
                      {getNextExecution(dca.lastExecution, dca.frequency)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DCA Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <ChartBarIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-gray-400 text-sm">Total DCA Orders</div>
              <div className="text-white text-2xl font-bold">{dcaOrders.length}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <CurrencyDollarIcon className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-gray-400 text-sm">Active Orders</div>
              <div className="text-white text-2xl font-bold">
                {dcaOrders.filter(dca => dca.isActive).length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <ArrowPathIcon className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-gray-400 text-sm">Total Executions</div>
              <div className="text-white text-2xl font-bold">
                {dcaOrders.reduce((sum, dca) => sum + dca.totalExecutions, 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DCATool 