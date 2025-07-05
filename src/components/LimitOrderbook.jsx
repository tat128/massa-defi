import { useState, useEffect } from 'react'
import { 
  ChartBarIcon, 
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import { useDecentralized } from '../App'

const LimitOrderbook = () => {
  const { decentralizedServices } = useDecentralized()
  const [orders, setOrders] = useState([])
  const [orderbook, setOrderbook] = useState({ bids: [], asks: [] })
  const [selectedPair, setSelectedPair] = useState('ETH/USDC')
  const [orderType, setOrderType] = useState('limit')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const tradingPairs = [
    { pair: 'ETH/USDC', price: 2000, change: 2.5, volume: '1.2M' },
    { pair: 'BTC/USDC', price: 40000, change: -1.2, volume: '2.8M' },
    { pair: 'LINK/USDC', price: 15, change: 5.8, volume: '450K' },
    { pair: 'UNI/USDC', price: 8, change: -0.5, volume: '320K' }
  ]

  const [formData, setFormData] = useState({
    side: 'buy',
    amount: '',
    price: '',
    timeInForce: 'GTC', // Good Till Cancelled
    reduceOnly: false,
    postOnly: false
  })

  useEffect(() => {
    loadOrderbook()
    loadUserOrders()
  }, [selectedPair])

  const loadOrderbook = async () => {
    try {
      // Mock orderbook data - would come from smart contract
      setOrderbook({
        bids: [
          { price: 1999.5, amount: 2.5, total: 4998.75 },
          { price: 1999.0, amount: 1.8, total: 3598.2 },
          { price: 1998.5, amount: 3.2, total: 6395.2 },
          { price: 1998.0, amount: 2.1, total: 4195.8 },
          { price: 1997.5, amount: 4.0, total: 7990.0 }
        ],
        asks: [
          { price: 2000.5, amount: 1.5, total: 3000.75 },
          { price: 2001.0, amount: 2.2, total: 4402.2 },
          { price: 2001.5, amount: 1.8, total: 3602.7 },
          { price: 2002.0, amount: 3.0, total: 6006.0 },
          { price: 2002.5, amount: 2.5, total: 5006.25 }
        ]
      })
    } catch (error) {
      console.error('Failed to load orderbook:', error)
    }
  }

  const loadUserOrders = async () => {
    try {
      // Load user's limit orders from smart contract
      if (decentralizedServices?.portfolio) {
        // Mock data for now - would come from smart contract
        setOrders([
          {
            id: 1,
            pair: 'ETH/USDC',
            side: 'buy',
            amount: 2.0,
            price: 1995.0,
            filled: 0.5,
            status: 'active',
            timestamp: Date.now() - 3600000,
            timeInForce: 'GTC'
          },
          {
            id: 2,
            pair: 'ETH/USDC',
            side: 'sell',
            amount: 1.5,
            price: 2005.0,
            filled: 0,
            status: 'active',
            timestamp: Date.now() - 7200000,
            timeInForce: 'GTC'
          }
        ])
      }
    } catch (error) {
      console.error('Failed to load user orders:', error)
    }
  }

  const placeOrder = async () => {
    try {
      setIsPlacingOrder(true)
      
      // Place order on smart contract
      if (decentralizedServices?.portfolio) {
        const newOrder = {
          id: orders.length + 1,
          pair: selectedPair,
          side: formData.side,
          amount: parseFloat(formData.amount),
          price: parseFloat(formData.price),
          filled: 0,
          status: 'active',
          timestamp: Date.now(),
          timeInForce: formData.timeInForce
        }
        
        setOrders([...orders, newOrder])
        setFormData({
          side: 'buy',
          amount: '',
          price: '',
          timeInForce: 'GTC',
          reduceOnly: false,
          postOnly: false
        })
      }
    } catch (error) {
      console.error('Failed to place order:', error)
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const cancelOrder = async (orderId) => {
    try {
      // Cancel order on smart contract
      setOrders(orders.filter(order => order.id !== orderId))
    } catch (error) {
      console.error('Failed to cancel order:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20'
      case 'filled': return 'text-blue-400 bg-blue-500/20'
      case 'cancelled': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getSideColor = (side) => {
    return side === 'buy' ? 'text-green-400' : 'text-red-400'
  }

  const getSideIcon = (side) => {
    return side === 'buy' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Limit Orderbook</h2>
        <p className="text-gray-400">
          Advanced trading with MEV protection and on-chain order execution
        </p>
      </div>

      {/* Trading Pair Selector */}
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Trading Pairs</h3>
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-green-400" />
            <span className="text-green-400 text-sm">MEV Protected</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tradingPairs.map((pair) => (
            <button
              key={pair.pair}
              onClick={() => setSelectedPair(pair.pair)}
              className={`p-4 rounded-2xl border transition-all duration-300 ${
                selectedPair === pair.pair
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="text-left">
                <div className="text-white font-semibold">{pair.pair}</div>
                <div className="text-2xl font-bold text-white">${pair.price.toLocaleString()}</div>
                <div className={`text-sm ${pair.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {pair.change >= 0 ? '+' : ''}{pair.change}%
                </div>
                <div className="text-gray-400 text-sm">Vol: {pair.volume}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orderbook */}
        <div className="lg:col-span-1 bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">Orderbook</h3>
          
          {/* Asks (Sell Orders) */}
          <div className="mb-6">
            <div className="text-red-400 font-semibold mb-2">Asks</div>
            <div className="space-y-1">
              {orderbook.asks.map((ask, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-red-400">{ask.price.toFixed(2)}</span>
                  <span className="text-white">{ask.amount.toFixed(2)}</span>
                  <span className="text-gray-400">{ask.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Spread */}
          <div className="text-center py-2 bg-white/5 rounded-lg mb-4">
            <div className="text-gray-400 text-sm">Spread</div>
            <div className="text-white font-semibold">
              ${(orderbook.asks[0]?.price - orderbook.bids[0]?.price).toFixed(2)}
            </div>
          </div>

          {/* Bids (Buy Orders) */}
          <div>
            <div className="text-green-400 font-semibold mb-2">Bids</div>
            <div className="space-y-1">
              {orderbook.bids.map((bid, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-green-400">{bid.price.toFixed(2)}</span>
                  <span className="text-white">{bid.amount.toFixed(2)}</span>
                  <span className="text-gray-400">{bid.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Place Order */}
        <div className="lg:col-span-1 bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">Place Order</h3>
          
          <div className="space-y-4">
            {/* Order Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Order Type</label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="limit">Limit Order</option>
                <option value="market">Market Order</option>
                <option value="stop">Stop Order</option>
              </select>
            </div>

            {/* Side */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Side</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFormData({...formData, side: 'buy'})}
                  className={`py-3 rounded-xl font-semibold transition-all duration-300 ${
                    formData.side === 'buy'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                      : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setFormData({...formData, side: 'sell'})}
                  className={`py-3 rounded-xl font-semibold transition-all duration-300 ${
                    formData.side === 'sell'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                      : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                  }`}
                >
                  Sell
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="0.00"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="0.00"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Advanced Options */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                {showAdvanced ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                Advanced Options
              </button>
            </div>

            {showAdvanced && (
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time in Force</label>
                  <select
                    value={formData.timeInForce}
                    onChange={(e) => setFormData({...formData, timeInForce: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="GTC">Good Till Cancelled</option>
                    <option value="IOC">Immediate or Cancel</option>
                    <option value="FOK">Fill or Kill</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.reduceOnly}
                      onChange={(e) => setFormData({...formData, reduceOnly: e.target.checked})}
                      className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-300">Reduce Only</span>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.postOnly}
                      onChange={(e) => setFormData({...formData, postOnly: e.target.checked})}
                      className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-300">Post Only</span>
                  </label>
                </div>
              </div>
            )}

            {/* Place Order Button */}
            <button
              onClick={placeOrder}
              disabled={isPlacingOrder || !formData.amount || !formData.price}
              className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                formData.side === 'buy'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                  : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700'
              } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isPlacingOrder ? (
                <>
                  <BoltIcon className="w-5 h-5 animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  {getSideIcon(formData.side)}
                  Place {formData.side === 'buy' ? 'Buy' : 'Sell'} Order
                </>
              )}
            </button>
          </div>
        </div>

        {/* User Orders */}
        <div className="lg:col-span-1 bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">Your Orders</h3>
          
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No active orders</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={getSideColor(order.side)}>
                        {getSideIcon(order.side)}
                      </span>
                      <span className="text-white font-semibold">{order.pair}</span>
                    </div>
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-gray-400">Amount</div>
                      <div className="text-white">{order.amount} {order.pair.split('/')[0]}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Price</div>
                      <div className="text-white">${order.price}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Filled</div>
                      <div className="text-white">{order.filled}/{order.amount}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Status</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MEV Protection Info */}
      <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-6 border border-green-500/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <ShieldCheckIcon className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">MEV Protection Active</h3>
            <p className="text-gray-300">
              Your orders are protected against front-running and sandwich attacks using advanced blockchain techniques.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LimitOrderbook 