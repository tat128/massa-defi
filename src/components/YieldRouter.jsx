import { useState, useEffect } from 'react'
import { 
  ArrowTrendingUpIcon, 
  ArrowPathIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  BoltIcon,
  Cog6ToothIcon,
  EyeIcon,
  EyeSlashIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { useDecentralized } from '../App'

const YieldRouter = () => {
  const { decentralizedServices } = useDecentralized()
  const [yieldRoutes, setYieldRoutes] = useState([])
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState(null)

  const protocols = [
    { name: 'Aave', apy: 8.5, risk: 'Low', icon: '🦁', color: 'blue' },
    { name: 'Compound', apy: 7.2, risk: 'Low', icon: '🔵', color: 'green' },
    { name: 'Yearn Finance', apy: 12.8, risk: 'Medium', icon: '🐟', color: 'purple' },
    { name: 'Curve Finance', apy: 15.3, risk: 'Medium', icon: '📈', color: 'pink' },
    { name: 'Convex Finance', apy: 18.7, risk: 'High', icon: '🎯', color: 'orange' },
    { name: 'Ribbon Finance', apy: 22.1, risk: 'High', icon: '🎀', color: 'red' }
  ]

  const tokens = [
    { symbol: 'USDC', name: 'USD Coin', balance: '10000', icon: '🔵' },
    { symbol: 'USDT', name: 'Tether', balance: '5000', icon: '🔵' },
    { symbol: 'DAI', name: 'Dai', balance: '3000', icon: '🟡' },
    { symbol: 'ETH', name: 'Ethereum', balance: '5', icon: '🔵' }
  ]

  useEffect(() => {
    loadYieldRoutes()
  }, [])

  const loadYieldRoutes = async () => {
    try {
      // Load user's yield routes from smart contract
      if (decentralizedServices?.portfolio) {
        // Mock data for now - would come from smart contract
        setYieldRoutes([
          {
            id: 1,
            name: 'Conservative Yield',
            tokens: ['USDC', 'USDT'],
            allocations: [60, 40],
            targetAPY: 8,
            currentAPY: 8.2,
            totalValue: 15000,
            isActive: true,
            lastOptimization: Date.now() - 3600000,
            riskLevel: 'Low'
          },
          {
            id: 2,
            name: 'Aggressive Yield',
            tokens: ['USDC', 'DAI', 'ETH'],
            allocations: [40, 30, 30],
            targetAPY: 15,
            currentAPY: 16.8,
            totalValue: 8000,
            isActive: true,
            lastOptimization: Date.now() - 7200000,
            riskLevel: 'High'
          }
        ])
      }
    } catch (error) {
      console.error('Failed to load yield routes:', error)
    }
  }

  const optimizeYield = async (routeId) => {
    try {
      setIsOptimizing(true)
      
      // Call smart contract to optimize yield
      if (decentralizedServices?.portfolio) {
        // Mock optimization - would call smart contract
        setYieldRoutes(routes => 
          routes.map(route => 
            route.id === routeId 
              ? { 
                  ...route, 
                  currentAPY: route.currentAPY + Math.random() * 2,
                  lastOptimization: Date.now()
                }
              : route
          )
        )
      }
    } catch (error) {
      console.error('Failed to optimize yield:', error)
    } finally {
      setIsOptimizing(false)
    }
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-green-400 bg-green-500/20'
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20'
      case 'High': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getProtocolColor = (color) => {
    switch (color) {
      case 'blue': return 'from-blue-500/20 to-blue-600/20'
      case 'green': return 'from-green-500/20 to-green-600/20'
      case 'purple': return 'from-purple-500/20 to-purple-600/20'
      case 'pink': return 'from-pink-500/20 to-pink-600/20'
      case 'orange': return 'from-orange-500/20 to-orange-600/20'
      case 'red': return 'from-red-500/20 to-red-600/20'
      default: return 'from-gray-500/20 to-gray-600/20'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Yield Router</h2>
        <p className="text-gray-400">
          Automatically route your funds to the best yield opportunities
        </p>
      </div>

      {/* Yield Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-gray-400 text-sm">Total APY</div>
              <div className="text-white text-2xl font-bold">12.4%</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <CurrencyDollarIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-gray-400 text-sm">Total Value</div>
              <div className="text-white text-2xl font-bold">$23,000</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <BoltIcon className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-gray-400 text-sm">Active Routes</div>
              <div className="text-white text-2xl font-bold">{yieldRoutes.filter(r => r.isActive).length}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <ArrowPathIcon className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="text-gray-400 text-sm">Last Optimized</div>
              <div className="text-white text-sm font-semibold">2 hours ago</div>
            </div>
          </div>
        </div>
      </div>

      {/* Yield Routes */}
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Your Yield Routes</h3>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
          >
            {showAdvanced ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </button>
        </div>

        {yieldRoutes.length === 0 ? (
          <div className="text-center py-8">
            <ArrowTrendingUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No yield routes yet. Create your first one!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {yieldRoutes.map((route) => (
              <div key={route.id} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="text-white font-semibold text-lg">{route.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(route.riskLevel)}`}>
                          {route.riskLevel} Risk
                        </span>
                        <span className="text-gray-400 text-sm">
                          ${route.totalValue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-gray-400 text-sm">Current APY</div>
                      <div className="text-white font-bold text-xl">{route.currentAPY.toFixed(1)}%</div>
                    </div>
                    
                    <button
                      onClick={() => optimizeYield(route.id)}
                      disabled={isOptimizing}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                    >
                      {isOptimizing ? (
                        <>
                          <ArrowPathIcon className="w-4 h-4 animate-spin" />
                          Optimizing...
                        </>
                      ) : (
                        <>
                          <BoltIcon className="w-4 h-4" />
                          Optimize
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Token Allocations */}
                <div className="mb-4">
                  <div className="text-gray-400 text-sm mb-2">Token Allocations</div>
                  <div className="flex gap-2">
                    {route.tokens.map((token, index) => (
                      <div key={token} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                        <span className="text-lg">{tokens.find(t => t.symbol === token)?.icon}</span>
                        <span className="text-white font-medium">{token}</span>
                        <span className="text-gray-400 text-sm">{route.allocations[index]}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Target: {route.targetAPY}%</span>
                    <span>Current: {route.currentAPY.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((route.currentAPY / route.targetAPY) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {showAdvanced && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <div className="text-gray-400 text-sm">Protocols Used</div>
                      <div className="text-white font-medium">3 protocols</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Last Optimization</div>
                      <div className="text-white font-medium">
                        {new Date(route.lastOptimization).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Optimization Count</div>
                      <div className="text-white font-medium">24 times</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Protocols */}
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold text-white mb-6">Available Protocols</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {protocols.map((protocol) => (
            <div key={protocol.name} className={`bg-gradient-to-br ${getProtocolColor(protocol.color)} rounded-2xl p-4 border border-white/10`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{protocol.icon}</span>
                  <div>
                    <div className="text-white font-semibold">{protocol.name}</div>
                    <div className={`text-xs px-2 py-1 rounded-full ${getRiskColor(protocol.risk)}`}>
                      {protocol.risk} Risk
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-xl">{protocol.apy}%</div>
                  <div className="text-gray-400 text-sm">APY</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <ShieldCheckIcon className="w-4 h-4" />
                <span>Audited & Secure</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2">
          <ArrowTrendingUpIcon className="w-5 h-5" />
          Create New Yield Route
        </button>
        
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2">
          <BoltIcon className="w-5 h-5" />
          Optimize All Routes
        </button>
      </div>
    </div>
  )
}

export default YieldRouter 