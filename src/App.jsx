import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Payments from './pages/Payments'
import Transactions from './pages/Transactions'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Security from './pages/Security'
import Education from './pages/Education'
import GasOptimizer from './pages/GasOptimizer'
import NotFound from './pages/NotFound'
import { NotificationProvider, useNotification } from './components/Layout'
import { initializeDecentralizedServices } from './utils/decentralizedData'

// Decentralized App Context
import { createContext, useContext } from 'react'

const DecentralizedContext = createContext()

export function useDecentralized() {
  return useContext(DecentralizedContext)
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-4">The app encountered an error. Please refresh the page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  console.log('App version: 1.0.1 - Loading...');
  const [decentralizedServices, setDecentralizedServices] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const { addNotification } = useNotification()

  // Initialize decentralized services when wallet connects
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Check if MetaMask is available
        if (typeof window.ethereum !== 'undefined') {
          const provider = window.ethereum
          
          // Request account access
          const accounts = await provider.request({ method: 'eth_requestAccounts' })
          
          if (accounts.length > 0) {
            setWalletConnected(true)
            
            // Initialize all decentralized services
            const services = await initializeDecentralizedServices(provider)
            setDecentralizedServices(services)
            
            addNotification({
              type: 'success',
              message: 'Decentralized services initialized!',
              description: 'Your app is now running autonomously without middlemen.'
            })
            
            // Start real-time price updates
            startPriceUpdates(services.priceFeed)
            
            // Load user preferences from decentralized storage
            loadUserPreferences(services.storage)
            
          } else {
            addNotification({
              type: 'warning',
              message: 'Wallet connection required',
              description: 'Please connect your wallet to use the decentralized features.'
            })
          }
        } else {
          if (!sessionStorage.getItem('metamaskNotified')) {
            addNotification({
              type: 'error',
              message: 'MetaMask not found',
              description: 'Please install MetaMask to use this decentralized app.'
            })
            sessionStorage.setItem('metamaskNotified', 'true')
          }
        }
      } catch (error) {
        console.error('Failed to initialize decentralized services:', error)
        addNotification({
          type: 'error',
          message: 'Initialization failed',
          description: 'Some decentralized features may not be available.'
        })
      } finally {
        setIsInitialized(true)
      }
    }

    initializeServices()
  }, [addNotification])

  // Real-time price updates from decentralized oracles
  const startPriceUpdates = (priceFeed) => {
    const updatePrices = async () => {
      try {
        const prices = await priceFeed.getAllPrices()
        // Update global state with real prices from Chainlink
        console.log('Updated prices from decentralized oracles:', prices)
      } catch (error) {
        console.error('Failed to update prices:', error)
      }
    }

    // Update every 30 seconds
    const interval = setInterval(updatePrices, 30000)
    updatePrices() // Initial update

    return () => clearInterval(interval)
  }

  // Load user preferences from decentralized storage
  const loadUserPreferences = async (storage) => {
    try {
      const userData = await storage.getUserData()
      if (userData) {
        console.log('Loaded user preferences from decentralized storage:', userData)
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error)
    }
  }

  // Handle wallet connection changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setWalletConnected(false)
          setDecentralizedServices(null)
          addNotification({
            type: 'warning',
            message: 'Wallet disconnected',
            description: 'Please reconnect your wallet to continue.'
          })
        } else {
          // Reinitialize services with new account
          window.location.reload()
        }
      })

      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })
    }
  }, [addNotification])

  return (
    <DecentralizedContext.Provider value={{ 
      decentralizedServices, 
      isInitialized, 
      walletConnected 
    }}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/security" element={<Security />} />
            <Route path="/education" element={<Education />} />
            <Route path="/gas-optimizer" element={<GasOptimizer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </DecentralizedContext.Provider>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </ErrorBoundary>
  )
}

export default App