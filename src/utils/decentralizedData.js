// Decentralized Data Sources - Simplified Version
// This version works with available dependencies

// Decentralized Storage (localStorage + IPFS simulation)
class DecentralizedStorage {
  constructor() {
    this.ipfsGateway = 'https://ipfs.io/ipfs/';
  }

  // Store user preferences locally with IPFS simulation
  async storeUserData(data) {
    try {
      const dataString = JSON.stringify(data);
      const hash = await this.generateIPFSHash(dataString);
      
      // Store locally with IPFS reference
      localStorage.setItem('userData', JSON.stringify({
        data: dataString,
        ipfsHash: hash,
        timestamp: Date.now()
      }));
      
      return hash;
    } catch (error) {
      console.error('Failed to store data:', error);
      // Fallback to localStorage only
      localStorage.setItem('userData', JSON.stringify(data));
      return null;
    }
  }

  // Retrieve user data from local storage
  async getUserData() {
    try {
      const stored = localStorage.getItem('userData');
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      return parsed.data ? JSON.parse(parsed.data) : parsed;
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      return null;
    }
  }

  // Generate a mock IPFS hash
  async generateIPFSHash(data) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return 'Qm' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

// Simplified Price Feed Manager
class DecentralizedPriceFeed {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 30000; // 30 seconds
  }

  // Get price from cache or fallback
  async getPrice(symbol) {
    try {
      // Check cache first
      const cached = this.cache.get(symbol);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.price;
      }

      // Simulate price fetch (in real app, would use Chainlink oracles)
      const price = this.getFallbackPrice(symbol);
      
      // Cache the result
      this.cache.set(symbol, {
        price,
        timestamp: Date.now()
      });

      return price;
    } catch (error) {
      console.error(`Failed to get price for ${symbol}:`, error);
      return this.getFallbackPrice(symbol);
    }
  }

  // Fallback price calculation
  getFallbackPrice(symbol) {
    const fallbackPrices = {
      'ETH': 2000 + Math.random() * 100,
      'BTC': 40000 + Math.random() * 1000,
      'USDC': 1,
      'USDT': 1,
      'LINK': 15 + Math.random() * 2,
      'UNI': 8 + Math.random() * 1,
      'AAVE': 100 + Math.random() * 10,
      'CRV': 0.5 + Math.random() * 0.1,
      'COMP': 50 + Math.random() * 5,
      'YFI': 8000 + Math.random() * 500
    };
    return fallbackPrices[symbol] || 1;
  }

  // Get all prices at once
  async getAllPrices() {
    const prices = {};
    const symbols = ['ETH', 'BTC', 'USDC', 'USDT', 'LINK', 'UNI', 'AAVE', 'CRV', 'COMP', 'YFI'];
    
    for (const symbol of symbols) {
      prices[symbol] = await this.getPrice(symbol);
    }
    
    return prices;
  }
}

// Simplified Gas Optimizer
class DecentralizedGasOptimizer {
  constructor() {
    this.storage = new DecentralizedStorage();
  }

  // Get optimal gas price
  async getOptimalGasPrice() {
    try {
      // Simulate gas price calculation
      const basePrice = 20 + Math.random() * 10;
      const userData = await this.storage.getUserData();
      const userPreferred = userData?.preferredGasPrice || 20;
      
      return Math.min(basePrice, userPreferred);
    } catch (error) {
      console.error('Failed to get optimal gas price:', error);
      return 20; // Default fallback
    }
  }
}

// Simplified Portfolio Tracker
class DecentralizedPortfolio {
  constructor() {
    this.storage = new DecentralizedStorage();
  }

  // Get portfolio data
  async getPortfolio(address) {
    try {
      const userData = await this.storage.getUserData();
      
      return {
        balances: {
          ETH: 5.2 + Math.random() * 2,
          USDC: 8000 + Math.random() * 1000,
          LINK: 200 + Math.random() * 50
        },
        preferences: userData?.preferences || {},
        history: [
          { timestamp: Date.now() - 86400000, balance: 1000 + Math.random() * 200 },
          { timestamp: Date.now() - 172800000, balance: 950 + Math.random() * 200 },
          { timestamp: Date.now() - 259200000, balance: 1100 + Math.random() * 200 }
        ]
      };
    } catch (error) {
      console.error('Failed to get portfolio:', error);
      return { balances: {}, preferences: {}, history: [] };
    }
  }
}

// Export all decentralized services
export const decentralizedStorage = new DecentralizedStorage();
export const decentralizedPriceFeed = new DecentralizedPriceFeed();
export const createDecentralizedGasOptimizer = () => new DecentralizedGasOptimizer();
export const createDecentralizedPortfolio = () => new DecentralizedPortfolio();

// Utility function to initialize all decentralized services
export const initializeDecentralizedServices = async (provider) => {
  const gasOptimizer = createDecentralizedGasOptimizer();
  const portfolio = createDecentralizedPortfolio();
  
  return {
    priceFeed: decentralizedPriceFeed,
    gasOptimizer,
    portfolio,
    storage: decentralizedStorage
  };
}; 