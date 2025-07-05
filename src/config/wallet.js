import { providers } from '@massalabs/wallet-provider';

export const initializeWallet = async () => {
  try {
    // Get available wallet providers with a 10-second timeout
    const walletProviders = await providers(true, 10000);
    
    if (walletProviders.length === 0) {
      throw new Error('No wallet providers found');
    }

    // Get the first available provider (usually MassaStation)
    const provider = walletProviders[0];
    
    // Get accounts from the provider
    const accounts = await provider.accounts();
    
    if (accounts.length === 0) {
      throw new Error('No accounts found in wallet');
    }

    return {
      provider,
      account: accounts[0]
    };
  } catch (error) {
    console.error('Wallet initialization error:', error);
    throw error;
  }
};