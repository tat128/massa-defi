#!/usr/bin/env node

/**
 * Decentralized Deployment Script
 * Deploys the app to IPFS, Arweave, and other decentralized platforms
 * No middlemen required - fully autonomous deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { ethers } = require('ethers');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

class DecentralizedDeployer {
  constructor() {
    this.config = this.loadConfig();
    this.deploymentResults = {};
  }

  loadConfig() {
    try {
      const configPath = path.join(process.cwd(), 'decentralized-deployment.json');
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (error) {
      log('Failed to load deployment config', 'red');
      process.exit(1);
    }
  }

  async deploy() {
    log('🚀 Starting Decentralized Deployment...', 'blue');
    log('No middlemen required - deploying to decentralized platforms', 'green');

    try {
      // Step 1: Build the application
      await this.buildApp();

      // Step 2: Deploy to IPFS
      if (this.config.decentralizedDeployment.deploymentTargets.ipfs.enabled) {
        await this.deployToIPFS();
      }

      // Step 3: Deploy to Arweave
      if (this.config.decentralizedDeployment.deploymentTargets.arweave.enabled) {
        await this.deployToArweave();
      }

      // Step 4: Deploy smart contracts
      await this.deploySmartContracts();

      // Step 5: Update ENS records
      if (this.config.decentralizedDeployment.deploymentTargets.ens.enabled) {
        await this.updateENS();
      }

      // Step 6: Verify deployment
      await this.verifyDeployment();

      // Step 7: Generate deployment report
      this.generateReport();

      log('✅ Decentralized deployment completed successfully!', 'green');
      log('🌐 Your app is now running autonomously without middlemen', 'green');

    } catch (error) {
      log(`❌ Deployment failed: ${error.message}`, 'red');
      process.exit(1);
    }
  }

  async buildApp() {
    log('📦 Building application...', 'yellow');
    
    try {
      execSync('npm run build', { stdio: 'inherit' });
      log('✅ Build completed successfully', 'green');
    } catch (error) {
      throw new Error('Build failed');
    }
  }

  async deployToIPFS() {
    log('🌐 Deploying to IPFS...', 'yellow');
    
    try {
      // Use ipfs-deploy to upload to IPFS
      const output = execSync('npx ipfs-deploy dist/ --pinning-service pinata', { 
        encoding: 'utf8' 
      });
      
      // Extract IPFS hash from output
      const ipfsHash = output.match(/Qm[a-zA-Z0-9]{44}/)?.[0];
      
      if (ipfsHash) {
        this.deploymentResults.ipfs = {
          hash: ipfsHash,
          url: `https://ipfs.io/ipfs/${ipfsHash}`,
          gateway: this.config.decentralizedDeployment.deploymentTargets.ipfs.gateway + ipfsHash
        };
        
        log(`✅ IPFS deployment successful: ${ipfsHash}`, 'green');
        log(`🌐 Access at: https://ipfs.io/ipfs/${ipfsHash}`, 'blue');
      } else {
        throw new Error('Failed to extract IPFS hash');
      }
    } catch (error) {
      log(`❌ IPFS deployment failed: ${error.message}`, 'red');
      throw error;
    }
  }

  async deployToArweave() {
    log('📜 Deploying to Arweave...', 'yellow');
    
    try {
      // Check if Arweave wallet exists
      const walletPath = this.config.decentralizedDeployment.deploymentTargets.arweave.walletPath;
      
      if (!fs.existsSync(walletPath)) {
        log('⚠️  Arweave wallet not found, creating new one...', 'yellow');
        this.createArweaveWallet(walletPath);
      }

      // Deploy to Arweave
      const output = execSync(`npx arweave-deploy dist/ --wallet ${walletPath}`, { 
        encoding: 'utf8' 
      });
      
      // Extract Arweave transaction ID
      const txId = output.match(/[a-zA-Z0-9]{43}/)?.[0];
      
      if (txId) {
        this.deploymentResults.arweave = {
          transactionId: txId,
          url: `https://arweave.net/${txId}`,
          permanent: true
        };
        
        log(`✅ Arweave deployment successful: ${txId}`, 'green');
        log(`🌐 Permanent URL: https://arweave.net/${txId}`, 'blue');
      } else {
        throw new Error('Failed to extract Arweave transaction ID');
      }
    } catch (error) {
      log(`❌ Arweave deployment failed: ${error.message}`, 'red');
      throw error;
    }
  }

  createArweaveWallet(walletPath) {
    try {
      // Generate a new Arweave wallet
      const { JWK } = require('arweave');
      const wallet = JWK.generate();
      
      fs.writeFileSync(walletPath, JSON.stringify(wallet));
      log('✅ Arweave wallet created successfully', 'green');
    } catch (error) {
      log(`❌ Failed to create Arweave wallet: ${error.message}`, 'red');
      throw error;
    }
  }

  async deploySmartContracts() {
    log('📋 Deploying smart contracts...', 'yellow');
    
    try {
      // Deploy contracts using Hardhat
      execSync('npx hardhat deploy --network mainnet', { stdio: 'inherit' });
      
      // Verify contracts on Etherscan
      execSync('npx hardhat verify --network mainnet', { stdio: 'inherit' });
      
      log('✅ Smart contracts deployed and verified', 'green');
    } catch (error) {
      log(`❌ Smart contract deployment failed: ${error.message}`, 'red');
      throw error;
    }
  }

  async updateENS() {
    log('🏷️  Updating ENS records...', 'yellow');
    
    try {
      const ensDomain = this.config.decentralizedDeployment.deploymentTargets.ens.domain;
      const ipfsHash = this.deploymentResults.ipfs?.hash;
      
      if (!ipfsHash) {
        throw new Error('IPFS hash not available for ENS update');
      }

      // Update ENS content hash to point to IPFS
      execSync(`npx ens-deploy ${ensDomain} --content-hash ipfs://${ipfsHash}`, { 
        stdio: 'inherit' 
      });
      
      this.deploymentResults.ens = {
        domain: ensDomain,
        url: `https://${ensDomain}`,
        contentHash: `ipfs://${ipfsHash}`
      };
      
      log(`✅ ENS updated: ${ensDomain}`, 'green');
      log(`🌐 Access at: https://${ensDomain}`, 'blue');
    } catch (error) {
      log(`❌ ENS update failed: ${error.message}`, 'red');
      throw error;
    }
  }

  async verifyDeployment() {
    log('🔍 Verifying deployment...', 'yellow');
    
    const checks = [
      { name: 'IPFS', url: this.deploymentResults.ipfs?.url },
      { name: 'Arweave', url: this.deploymentResults.arweave?.url },
      { name: 'ENS', url: this.deploymentResults.ens?.url }
    ];

    for (const check of checks) {
      if (check.url) {
        try {
          const response = await fetch(check.url);
          if (response.ok) {
            log(`✅ ${check.name} verification successful`, 'green');
          } else {
            log(`⚠️  ${check.name} verification failed: ${response.status}`, 'yellow');
          }
        } catch (error) {
          log(`❌ ${check.name} verification failed: ${error.message}`, 'red');
        }
      }
    }
  }

  generateReport() {
    log('📊 Generating deployment report...', 'yellow');
    
    const report = {
      timestamp: new Date().toISOString(),
      deployment: this.deploymentResults,
      config: this.config.decentralizedDeployment,
      status: 'success'
    };

    // Save report to file
    const reportPath = path.join(process.cwd(), 'deployment-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Display summary
    log('\n📋 Deployment Summary:', 'blue');
    log('====================', 'blue');
    
    if (this.deploymentResults.ipfs) {
      log(`🌐 IPFS: ${this.deploymentResults.ipfs.url}`, 'green');
    }
    
    if (this.deploymentResults.arweave) {
      log(`📜 Arweave: ${this.deploymentResults.arweave.url}`, 'green');
    }
    
    if (this.deploymentResults.ens) {
      log(`🏷️  ENS: ${this.deploymentResults.ens.url}`, 'green');
    }
    
    log('\n🎉 Your app is now fully decentralized and autonomous!', 'green');
    log('💡 No middlemen required - runs forever on the blockchain', 'blue');
  }
}

// Run deployment
if (require.main === module) {
  const deployer = new DecentralizedDeployer();
  deployer.deploy().catch(console.error);
}

module.exports = DecentralizedDeployer; 