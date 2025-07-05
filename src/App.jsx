import { useState, useEffect } from 'react'
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
import { NotificationProvider, useNotification } from './components/Layout'
import { initializeDecentralizedServices } from './utils/decentralizedData'

// Decentralized App Context
import { createContext, useContext } from 'react'

const DecentralizedContext = createContext()

export function useDecentralized() {
  return useContext(DecentralizedContext)
}

function AppContent() {
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
          </Routes>
        </Layout>
      </Router>
    </DecentralizedContext.Provider>
  )
}

function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  )
}

export default App