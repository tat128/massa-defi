// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title DeFiCore
 * @dev Core DeFi functionality that runs autonomously on the blockchain
 * No middlemen required - everything is trustless and decentralized
 */
contract DeFiCore is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // Events
    event TokenSwap(
        address indexed user,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 timestamp
    );

    event PortfolioUpdated(
        address indexed user,
        uint256 totalValue,
        uint256 timestamp
    );

    event GasOptimized(
        address indexed user,
        uint256 originalGas,
        uint256 optimizedGas,
        uint256 savings
    );

    event UserPreferenceSet(
        address indexed user,
        string key,
        string value,
        uint256 timestamp
    );

    // Structs
    struct TokenInfo {
        address tokenAddress;
        string symbol;
        uint8 decimals;
        bool isActive;
        uint256 price; // Price in USD (8 decimals)
        uint256 lastUpdate;
    }

    struct UserPortfolio {
        mapping(address => uint256) balances;
        uint256 totalValue;
        uint256 lastUpdate;
        bool exists;
    }

    struct UserPreferences {
        mapping(string => string) preferences;
        uint256 gasPrice;
        bool autoOptimize;
        uint256 lastUpdate;
    }

    // State variables
    mapping(address => TokenInfo) public supportedTokens;
    mapping(address => UserPortfolio) public userPortfolios;
    mapping(address => UserPreferences) public userPreferences;
    mapping(address => uint256) public userBalances;
    
    address[] public tokenList;
    uint256 public totalUsers;
    uint256 public totalVolume;
    
    // Constants
    uint256 public constant PRICE_PRECISION = 1e8;
    uint256 public constant MIN_SWAP_AMOUNT = 1e6; // 0.001 tokens
    uint256 public constant MAX_SLIPPAGE = 500; // 5%
    
    // Modifiers
    modifier onlySupportedToken(address token) {
        require(supportedTokens[token].isActive, "Token not supported");
        _;
    }

    modifier validAmount(uint256 amount) {
        require(amount > 0, "Amount must be greater than 0");
        _;
    }

    /**
     * @dev Initialize the contract with supported tokens
     */
    constructor() {
        // Add common tokens (addresses would be real in production)
        _addToken(0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8, "ETH", 18);
        _addToken(0xB0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8, "USDC", 6);
        _addToken(0xC0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8, "USDT", 6);
        _addToken(0xD0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8, "LINK", 18);
        _addToken(0xE0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8, "UNI", 18);
    }

    /**
     * @dev Add a new supported token
     */
    function addSupportedToken(
        address tokenAddress,
        string memory symbol,
        uint8 decimals
    ) external onlyOwner {
        _addToken(tokenAddress, symbol, decimals);
    }

    function _addToken(address tokenAddress, string memory symbol, uint8 decimals) internal {
        require(tokenAddress != address(0), "Invalid token address");
        require(!supportedTokens[tokenAddress].isActive, "Token already supported");
        
        supportedTokens[tokenAddress] = TokenInfo({
            tokenAddress: tokenAddress,
            symbol: symbol,
            decimals: decimals,
            isActive: true,
            price: 0,
            lastUpdate: block.timestamp
        });
        
        tokenList.push(tokenAddress);
    }

    /**
     * @dev Update token price from oracle
     */
    function updateTokenPrice(address token, uint256 price) external onlyOwner {
        require(supportedTokens[token].isActive, "Token not supported");
        supportedTokens[token].price = price;
        supportedTokens[token].lastUpdate = block.timestamp;
    }

    /**
     * @dev Swap tokens using on-chain liquidity pools
     */
    function swapTokens(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) external nonReentrant onlySupportedToken(tokenIn) onlySupportedToken(tokenOut) validAmount(amountIn) {
        require(tokenIn != tokenOut, "Cannot swap same token");
        require(amountIn >= MIN_SWAP_AMOUNT, "Amount too small");
        
        // Transfer tokens from user
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        
        // Calculate swap amount (simplified - in production would use DEX pools)
        uint256 amountOut = _calculateSwapAmount(tokenIn, tokenOut, amountIn);
        require(amountOut >= minAmountOut, "Slippage too high");
        
        // Transfer tokens to user
        IERC20(tokenOut).safeTransfer(msg.sender, amountOut);
        
        // Update portfolio
        _updateUserPortfolio(msg.sender);
        
        // Emit event
        emit TokenSwap(msg.sender, tokenIn, tokenOut, amountIn, amountOut, block.timestamp);
        
        totalVolume += amountIn;
    }

    /**
     * @dev Calculate swap amount based on token prices
     */
    function _calculateSwapAmount(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) internal view returns (uint256) {
        uint256 priceIn = supportedTokens[tokenIn].price;
        uint256 priceOut = supportedTokens[tokenOut].price;
        
        require(priceIn > 0 && priceOut > 0, "Price not available");
        
        // Calculate USD value and convert to output token
        uint256 usdValue = (amountIn * priceIn) / PRICE_PRECISION;
        uint256 amountOut = (usdValue * PRICE_PRECISION) / priceOut;
        
        // Apply slippage protection
        uint256 maxSlippage = (amountOut * MAX_SLIPPAGE) / 10000;
        return amountOut - maxSlippage;
    }

    /**
     * @dev Update user portfolio with current balances
     */
    function updatePortfolio() external {
        _updateUserPortfolio(msg.sender);
    }

    function _updateUserPortfolio(address user) internal {
        UserPortfolio storage portfolio = userPortfolios[user];
        
        if (!portfolio.exists) {
            portfolio.exists = true;
            totalUsers++;
        }
        
        uint256 totalValue = 0;
        
        // Calculate total portfolio value
        for (uint256 i = 0; i < tokenList.length; i++) {
            address token = tokenList[i];
            uint256 balance = IERC20(token).balanceOf(user);
            portfolio.balances[token] = balance;
            
            if (balance > 0 && supportedTokens[token].price > 0) {
                uint256 tokenValue = (balance * supportedTokens[token].price) / PRICE_PRECISION;
                totalValue += tokenValue;
            }
        }
        
        portfolio.totalValue = totalValue;
        portfolio.lastUpdate = block.timestamp;
        
        emit PortfolioUpdated(user, totalValue, block.timestamp);
    }

    /**
     * @dev Get user portfolio data
     */
    function getUserPortfolio(address user) external view returns (
        uint256 totalValue,
        uint256 lastUpdate,
        address[] memory tokens,
        uint256[] memory balances
    ) {
        UserPortfolio storage portfolio = userPortfolios[user];
        
        if (!portfolio.exists) {
            return (0, 0, new address[](0), new uint256[](0));
        }
        
        tokens = new address[](tokenList.length);
        balances = new uint256[](tokenList.length);
        
        for (uint256 i = 0; i < tokenList.length; i++) {
            tokens[i] = tokenList[i];
            balances[i] = portfolio.balances[tokens[i]];
        }
        
        return (portfolio.totalValue, portfolio.lastUpdate, tokens, balances);
    }

    /**
     * @dev Set user preferences (stored on-chain)
     */
    function setUserPreference(string memory key, string memory value) external {
        UserPreferences storage prefs = userPreferences[msg.sender];
        prefs.preferences[key] = value;
        prefs.lastUpdate = block.timestamp;
        
        emit UserPreferenceSet(msg.sender, key, value, block.timestamp);
    }

    /**
     * @dev Get user preference
     */
    function getUserPreference(address user, string memory key) external view returns (string memory) {
        return userPreferences[user].preferences[key];
    }

    /**
     * @dev Set gas optimization preferences
     */
    function setGasPreferences(uint256 gasPrice, bool autoOptimize) external {
        UserPreferences storage prefs = userPreferences[msg.sender];
        prefs.gasPrice = gasPrice;
        prefs.autoOptimize = autoOptimize;
        prefs.lastUpdate = block.timestamp;
    }

    /**
     * @dev Get optimal gas price based on network conditions
     */
    function getOptimalGasPrice() external view returns (uint256) {
        // In production, this would query multiple sources
        // For now, return a reasonable estimate
        return block.basefee + 2 gwei;
    }

    /**
     * @dev Get all supported tokens
     */
    function getSupportedTokens() external view returns (address[] memory) {
        return tokenList;
    }

    /**
     * @dev Get token info
     */
    function getTokenInfo(address token) external view returns (
        string memory symbol,
        uint8 decimals,
        bool isActive,
        uint256 price,
        uint256 lastUpdate
    ) {
        TokenInfo storage tokenInfo = supportedTokens[token];
        return (
            tokenInfo.symbol,
            tokenInfo.decimals,
            tokenInfo.isActive,
            tokenInfo.price,
            tokenInfo.lastUpdate
        );
    }

    /**
     * @dev Emergency function to recover stuck tokens
     */
    function emergencyWithdraw(address token) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        if (balance > 0) {
            IERC20(token).safeTransfer(owner(), balance);
        }
    }

    /**
     * @dev Get contract statistics
     */
    function getStats() external view returns (
        uint256 _totalUsers,
        uint256 _totalVolume,
        uint256 _supportedTokens
    ) {
        return (totalUsers, totalVolume, tokenList.length);
    }
} 