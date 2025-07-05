import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  WalletIcon,
  CreditCardIcon,
  ChartBarIcon,
  QrCodeIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'
import {
  BTCIcon, ETHIcon, USDTIcon, USDCIcon, BNBIcon, SOLIcon, ADAIcon, DOTIcon, MATICIcon, LINKIcon, UNIIcon, AAVEIcon, COMPIcon, CRVIcon, SUSHIIcon, YFIIcon, MKRIcon, SNXIcon, BALIcon, INCHIcon, MASSAIcon
} from '../components/TokenIcons'

// Mock price data for tokens
const tokenPrices = {
  'MASSA': { price: 0.045, change24h: 2.34, marketCap: '1.2B', volume24h: '45.2M' },
  'BTC': { price: 43250.67, change24h: -1.23, marketCap: '845.6B', volume24h: '28.4B' },
  'ETH': { price: 2650.89, change24h: 3.45, marketCap: '318.7B', volume24h: '15.2B' },
  'USDC': { price: 1.00, change24h: 0.01, marketCap: '45.2B', volume24h: '8.9B' },
  'USDT': { price: 0.999, change24h: -0.02, marketCap: '95.8B', volume24h: '52.1B' },
  'BNB': { price: 312.45, change24h: 1.67, marketCap: '48.2B', volume24h: '1.8B' },
  'SOL': { price: 98.76, change24h: 5.23, marketCap: '42.1B', volume24h: '2.3B' },
  'ADA': { price: 0.456, change24h: -2.11, marketCap: '16.2B', volume24h: '890M' },
  'DOT': { price: 7.23, change24h: 1.89, marketCap: '9.8B', volume24h: '420M' },
  'MATIC': { price: 0.89, change24h: 4.56, marketCap: '8.9B', volume24h: '650M' },
  'LINK': { price: 15.67, change24h: 2.34, marketCap: '9.2B', volume24h: '780M' },
  'UNI': { price: 7.89, change24h: -1.45, marketCap: '4.7B', volume24h: '320M' },
  'AAVE': { price: 89.45, change24h: 3.21, marketCap: '1.3B', volume24h: '180M' },
  'COMP': { price: 67.23, change24h: -0.89, marketCap: '670M', volume24h: '95M' },
  'CRV': { price: 0.56, change24h: 1.23, marketCap: '520M', volume24h: '45M' },
  'SUSHI': { price: 1.23, change24h: -2.67, marketCap: '230M', volume24h: '28M' },
  'YFI': { price: 8900.45, change24h: 4.12, marketCap: '290M', volume24h: '15M' },
  'MKR': { price: 2345.67, change24h: 1.78, marketCap: '2.1B', volume24h: '120M' },
  'SNX': { price: 3.45, change24h: -1.34, marketCap: '1.1B', volume24h: '85M' },
  'BAL': { price: 4.67, change24h: 2.89, marketCap: '260M', volume24h: '32M' },
  '1INCH': { price: 0.34, change24h: 1.45, marketCap: '380M', volume24h: '45M' }
}

const features = [
  {
    title: 'Zero Fees',
    description: 'Trade and swap tokens without any hidden fees or charges.',
    icon: WalletIcon,
  },
  {
    title: 'Instant Swaps',
    description: 'Lightning-fast token swaps with real-time price feeds.',
    icon: CreditCardIcon,
  },
  {
    title: 'Secure Storage',
    description: 'Your assets are protected with enterprise-grade security.',
    icon: ChartBarIcon,
  },
  {
    title: 'Global Access',
    description: 'Access your portfolio from anywhere in the world.',
    icon: QrCodeIcon,
  },
]

const tokens = [
  { symbol: 'BTC', name: 'Bitcoin', icon: BTCIcon, color: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum', icon: ETHIcon, color: '#627EEA' },
  { symbol: 'USDT', name: 'Tether', icon: USDTIcon, color: '#26A17B' },
  { symbol: 'USDC', name: 'USD Coin', icon: USDCIcon, color: '#2775CA' },
  { symbol: 'BNB', name: 'Binance Coin', icon: BNBIcon, color: '#F3BA2F' },
  { symbol: 'SOL', name: 'Solana', icon: SOLIcon, color: '#14F195' },
  { symbol: 'ADA', name: 'Cardano', icon: ADAIcon, color: '#0033AD' },
  { symbol: 'DOT', name: 'Polkadot', icon: DOTIcon, color: '#E6007A' },
  { symbol: 'MATIC', name: 'Polygon', icon: MATICIcon, color: '#8247E5' },
  { symbol: 'LINK', name: 'Chainlink', icon: LINKIcon, color: '#2A5ADA' },
  { symbol: 'UNI', name: 'Uniswap', icon: UNIIcon, color: '#FF007A' },
  { symbol: 'AAVE', name: 'Aave', icon: AAVEIcon, color: '#B6509E' },
  { symbol: 'COMP', name: 'Compound', icon: COMPIcon, color: '#00D395' },
  { symbol: 'CRV', name: 'Curve DAO', icon: CRVIcon, color: '#D53394' },
  { symbol: 'SUSHI', name: 'SushiSwap', icon: SUSHIIcon, color: '#FA52A0' },
  { symbol: 'YFI', name: 'yearn.finance', icon: YFIIcon, color: '#006AE3' },
  { symbol: 'MKR', name: 'Maker', icon: MKRIcon, color: '#1AAB9B' },
  { symbol: 'SNX', name: 'Synthetix', icon: SNXIcon, color: '#00D1FF' },
  { symbol: 'BAL', name: 'Balancer', icon: BALIcon, color: '#1E1E1E' },
  { symbol: '1INCH', name: '1inch', icon: INCHIcon, color: '#000000' },
  { symbol: 'MASSA', name: 'Massa', icon: MASSAIcon, color: '#2D5AF6' },
]

const tokenDetails = {
  BTC: {
    networkFee: '0.00%',
    processingTime: '~5 sec',
    minTx: '5 BTC',
    supportedNetworks: 3,
  },
  ETH: {
    networkFee: '0.01%',
    processingTime: '~10 sec',
    minTx: '0.1 ETH',
    supportedNetworks: 4,
  },
  USDT: {
    networkFee: '0.02%',
    processingTime: '~3 sec',
    minTx: '10 USDT',
    supportedNetworks: 5,
  },
  USDC: {
    networkFee: '0.01%',
    processingTime: '~3 sec',
    minTx: '10 USDC',
    supportedNetworks: 5,
  },
  BNB: {
    networkFee: '0.00%',
    processingTime: '~2 sec',
    minTx: '0.5 BNB',
    supportedNetworks: 2,
  },
  SOL: {
    networkFee: '0.00%',
    processingTime: '~1 sec',
    minTx: '1 SOL',
    supportedNetworks: 2,
  },
  ADA: {
    networkFee: '0.01%',
    processingTime: '~8 sec',
    minTx: '10 ADA',
    supportedNetworks: 3,
  },
  DOT: {
    networkFee: '0.01%',
    processingTime: '~7 sec',
    minTx: '2 DOT',
    supportedNetworks: 2,
  },
}

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedToken, setSelectedToken] = useState(null)
  const [showTokenModal, setShowTokenModal] = useState(false)
  const [selected, setSelected] = useState(0)
  const scrollRef = useRef(null)
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('massa-hide-home')) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 21) // 21 tokens total
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 21)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 21) % 21)
  }

  const handleTokenClick = (token) => {
    setSelectedToken(token)
    setShowTokenModal(true)
  }

  const closeTokenModal = () => {
    setShowTokenModal(false)
    setSelectedToken(null)
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -120, behavior: 'smooth' })
    }
  }
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 120, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1a237e] to-[#512da8] flex flex-col items-center pt-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Massa DeFi
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              The next generation of decentralized finance. Trade, earn, and manage your assets with zero fees and maximum security.
            </p>
            <button
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              onClick={() => {
                console.log('Get Started button clicked!');
                localStorage.setItem('massa-hide-home', '1');
                console.log('Navigating to /dashboard...');
                navigate('/dashboard');
                console.log('Navigation completed');
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Massa DeFi?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform combines the best of blockchain technology with user-friendly design 
              to revolutionize decentralized finance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Token Slideshow Section */}
      <section className="py-20 relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300 font-medium">Live Market Data</span>
            </div>
            <h2 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Supported Tokens
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore our comprehensive selection of cryptocurrencies with real-time pricing and market insights
            </p>
          </div>
          
          {/* Enhanced Token Grid */}
          <div className="relative mb-12 animate-fade-in">
            <div className="w-full max-w-6xl mx-auto">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-4 px-4 py-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                {tokens.map((token, idx) => (
                  <div
                    key={token.symbol}
                    onClick={() => setSelected(idx)}
                    className={`group relative flex flex-col items-center cursor-pointer transition-all duration-500 animate-scale-in ${selected === idx ? 'scale-110 z-10' : 'opacity-70 hover:opacity-100 hover:scale-105'} hover:shadow-strong active:scale-95`}
                  >
                    {/* Glowing background effect for selected token */}
                    {selected === idx && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl scale-150"></div>
                    )}
                    
                    <div className="relative">
                      <div
                        className={`relative flex items-center justify-center w-14 h-14 rounded-2xl mb-2 transition-all duration-500 group-hover:shadow-2xl animate-fade-in ${
                          selected === idx 
                            ? 'bg-gradient-to-br from-white/20 to-white/10 shadow-2xl' 
                            : 'bg-white/10 backdrop-blur-sm hover:bg-white/15'
                        }`}
                        style={{ 
                          boxShadow: selected === idx 
                            ? `0 0 30px ${token.color}40, inset 0 1px 0 rgba(255,255,255,0.2)` 
                            : '0 4px 20px rgba(0,0,0,0.1)'
                        }}
                      >
                        {(() => {
                          const Icon = token.icon;
                          return Icon ? <Icon className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" /> : <span className="text-xl" style={{ color: token.color }}>{token.symbol}</span>;
                        })()}
                        
                        {/* Price indicator dot */}
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
                      </div>
                    </div>
                    
                    <div className={`text-center transition-all duration-300 animate-fade-in ${selected === idx ? 'text-white' : 'text-gray-300'}`}>
                      <div className={`font-semibold text-xs mb-0.5 ${selected === idx ? 'text-white' : 'text-gray-200'}`}>
                        {token.name}
                      </div>
                      <div className={`text-[10px] tracking-wider opacity-80 ${selected === idx ? 'text-blue-300' : 'text-gray-400'}`}>
                        {token.symbol}
                      </div>
                      
                      {/* Price display for selected token */}
                      {selected === idx && tokenPrices[token.symbol] && (
                        <div className="mt-1 text-[10px] animate-fade-in">
                          <div className="text-white font-bold">
                            ${tokenPrices[token.symbol].price.toLocaleString()}
                          </div>
                          <div className={`flex items-center justify-center gap-0.5 text-[10px] ${
                            tokenPrices[token.symbol].change24h >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {tokenPrices[token.symbol].change24h >= 0 ? (
                              <ArrowUpIcon className="w-2.5 h-2.5" />
                            ) : (
                              <ArrowDownIcon className="w-2.5 h-2.5" />
                            )}
                            {tokenPrices[token.symbol].change24h >= 0 ? '+' : ''}
                            {tokenPrices[token.symbol].change24h}%
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Token Details Card */}
          <div className="w-full max-w-3xl mx-auto">
            <div className="relative group">
              {/* Card background with glassmorphism */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"></div>
              
              {/* Animated border gradient */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              
              <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-xl">
                {/* Header with token info */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                        style={{ 
                          background: `linear-gradient(135deg, ${tokens[selected].color}20, ${tokens[selected].color}10)`,
                          boxShadow: `0 8px 32px ${tokens[selected].color}30`
                        }}
                      >
                        {(() => {
                          const Icon = tokens[selected].icon;
                          return Icon ? <Icon className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" /> : <span className="text-xl" style={{ color: tokens[selected].color }}>{tokens[selected].symbol}</span>;
                        })()}
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">{tokens[selected].name}</div>
                      <div className="text-gray-400 font-mono text-sm">{tokens[selected].symbol}</div>
                    </div>
                  </div>
                  
                  {/* Live price indicator */}
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white mb-1">
                      ${tokenPrices[tokens[selected].symbol]?.price.toLocaleString() || '0.00'}
                    </div>
                    <div className={`flex items-center justify-end gap-1 text-sm ${
                      tokenPrices[tokens[selected].symbol]?.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {tokenPrices[tokens[selected].symbol]?.change24h >= 0 ? (
                        <ArrowUpIcon className="w-4 h-4" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4" />
                      )}
                      <span className="font-semibold">
                        {tokenPrices[tokens[selected].symbol]?.change24h >= 0 ? '+' : ''}
                        {tokenPrices[tokens[selected].symbol]?.change24h || 0}%
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Stats grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Network Fee', value: tokenDetails[tokens[selected].symbol]?.networkFee || '0.00%', icon: '⚡' },
                    { label: 'Processing Time', value: tokenDetails[tokens[selected].symbol]?.processingTime || '~5 sec', icon: '⏱️' },
                    { label: 'Min. Transaction', value: tokenDetails[tokens[selected].symbol]?.minTx || '1.0', icon: '💰' },
                    { label: 'Supported Networks', value: tokenDetails[tokens[selected].symbol]?.supportedNetworks || '3', icon: '🌐' }
                  ].map((stat, index) => (
                    <div key={index} className="group/stat relative">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{stat.icon}</span>
                          <div className="text-gray-400 text-xs font-medium">{stat.label}</div>
                        </div>
                        <div className="text-white font-bold text-lg">{stat.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-4">
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2">
                    <WalletIcon className="w-5 h-5" />
                    Trade Now
                  </button>
                  <button className="flex-1 bg-white/10 backdrop-blur-sm text-white py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-105 flex items-center justify-center gap-2">
                    <ChartBarIcon className="w-5 h-5" />
                    View Chart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Token Details Modal */}
      {showTokenModal && selectedToken && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedToken.name} ({selectedToken.symbol})
              </h3>
              <button
                onClick={closeTokenModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="text-center mb-6">
              <div 
                className="text-6xl mb-4"
                style={{ color: selectedToken.color }}
              >
                {(() => {
                  const Icon = selectedToken.icon;
                  return Icon ? <Icon className="w-8 h-8" /> : <span className="text-xl" style={{ color: selectedToken.color }}>{selectedToken.symbol}</span>;
                })()}
              </div>
            </div>

            {tokenPrices[selectedToken.symbol] && (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Current Price</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${tokenPrices[selectedToken.symbol].price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">24h Change</span>
                    <div className={`flex items-center gap-1 ${
                      tokenPrices[selectedToken.symbol].change24h >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {tokenPrices[selectedToken.symbol].change24h >= 0 ? (
                        <ArrowUpIcon className="w-4 h-4" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4" />
                      )}
                      <span className="font-semibold">
                        {tokenPrices[selectedToken.symbol].change24h >= 0 ? '+' : ''}
                        {tokenPrices[selectedToken.symbol].change24h}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Market Cap</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${tokenPrices[selectedToken.symbol].marketCap}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">24h Volume</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${tokenPrices[selectedToken.symbol].volume24h}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                Trade Now
              </button>
              <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300">
                Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Features Showcase */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful DeFi Features</h2>
            <p className="text-xl text-gray-300">
              Everything you need to manage your DeFi portfolio globally and securely.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <WalletIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Portfolio Management</h3>
                    <p className="text-gray-300">Track and manage all your crypto assets in one place with real-time updates and analytics.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CreditCardIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Send & Receive</h3>
                    <p className="text-gray-300">Send and receive cryptocurrencies instantly with zero transaction fees.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <QrCodeIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">QR Payments</h3>
                    <p className="text-gray-300">Scan and pay through crypto with our integrated QR code system.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ChartBarIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Analytics & Charts</h3>
                    <p className="text-gray-300">Advanced analytics and charts to track your portfolio performance over time.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
                    <span className="text-white font-medium">Portfolio Value</span>
                  </div>
                  <span className="text-blue-400 font-bold">₳ 24,500.00</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
                    <span className="text-white font-medium">Total Transactions</span>
                  </div>
                  <span className="text-purple-400 font-bold">1,247</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full"></div>
                    <span className="text-white font-medium">Success Rate</span>
                  </div>
                  <span className="text-green-400 font-bold">99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your DeFi Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who are already managing their crypto portfolios with Massa DeFi.
          </p>
          <Link
            to="/dashboard"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
          >
            Launch App
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home 