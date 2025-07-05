// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title DeFiPrimitives
 * @dev Innovative DeFi primitives: DCA, Yield Router, Limit Orders
 * Autonomous smart contracts that do what other chains can't
 */
contract DeFiPrimitives is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;

    // Events
    event DCACreated(
        address indexed user,
        uint256 dcaId,
        address tokenIn,
        address tokenOut,
        uint256 amount,
        uint256 frequency,
        uint256 startTime
    );

    event DCAExecuted(
        uint256 indexed dcaId,
        address indexed user,
        uint256 amountIn,
        uint256 amountOut,
        uint256 timestamp
    );

    event YieldRouteCreated(
        address indexed user,
        uint256 routeId,
        address[] tokens,
        uint256[] allocations,
        uint256 targetAPY
    );

    event YieldOptimized(
        uint256 indexed routeId,
        address indexed user,
        uint256 oldAPY,
        uint256 newAPY,
        uint256 timestamp
    );

    event LimitOrderPlaced(
        address indexed user,
        uint256 orderId,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 price,
        bool isBuy
    );

    event LimitOrderExecuted(
        uint256 indexed orderId,
        address indexed user,
        uint256 amountIn,
        uint256 amountOut,
        uint256 executedPrice
    );

    event AutomatedPayment(
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 paymentId,
        uint256 timestamp
    );

    event NFTEvolved(
        address indexed user,
        uint256 tokenId,
        uint256 oldLevel,
        uint256 newLevel,
        string evolutionType
    );

    event LiquidationProtected(
        address indexed user,
        uint256 collateralValue,
        uint256 debtValue,
        uint256 protectionAmount
    );

    // Structs
    struct DCA {
        address user;
        address tokenIn;
        address tokenOut;
        uint256 amount;
        uint256 frequency; // seconds
        uint256 lastExecution;
        uint256 startTime;
        bool isActive;
        uint256 totalExecutions;
        uint256 totalAmountIn;
        uint256 totalAmountOut;
    }

    struct YieldRoute {
        address user;
        address[] tokens;
        uint256[] allocations;
        uint256 targetAPY;
        uint256 currentAPY;
        uint256 lastOptimization;
        bool isActive;
        uint256 totalValue;
    }

    struct LimitOrder {
        address user;
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 price;
        bool isBuy;
        uint256 timestamp;
        bool isActive;
        uint256 filledAmount;
    }

    struct AutomatedPayment {
        address from;
        address to;
        uint256 amount;
        uint256 frequency;
        uint256 lastPayment;
        uint256 startTime;
        bool isActive;
        uint256 totalPayments;
    }

    struct EvolvingNFT {
        address user;
        uint256 level;
        uint256 experience;
        uint256 lastEvolution;
        string metadata;
        bool exists;
    }

    struct LiquidationProtection {
        address user;
        uint256 collateralValue;
        uint256 debtValue;
        uint256 protectionAmount;
        uint256 lastCheck;
        bool isProtected;
    }

    // State variables
    mapping(uint256 => DCA) public dcaOrders;
    mapping(uint256 => YieldRoute) public yieldRoutes;
    mapping(uint256 => LimitOrder) public limitOrders;
    mapping(uint256 => AutomatedPayment) public automatedPayments;
    mapping(uint256 => EvolvingNFT) public evolvingNFTs;
    mapping(address => LiquidationProtection) public liquidationProtections;
    
    mapping(address => uint256[]) public userDCAs;
    mapping(address => uint256[]) public userYieldRoutes;
    mapping(address => uint256[]) public userLimitOrders;
    mapping(address => uint256[]) public userPayments;
    mapping(address => uint256) public userNFTs;

    Counters.Counter private _dcaCounter;
    Counters.Counter private _yieldCounter;
    Counters.Counter private _orderCounter;
    Counters.Counter private _paymentCounter;
    Counters.Counter private _nftCounter;

    // Constants
    uint256 public constant MIN_DCA_AMOUNT = 1e6; // 0.001 tokens
    uint256 public constant MAX_SLIPPAGE = 500; // 5%
    uint256 public constant YIELD_OPTIMIZATION_THRESHOLD = 100; // 1% APY difference
    uint256 public constant LIQUIDATION_THRESHOLD = 150; // 150% collateral ratio

    // Modifiers
    modifier onlyDCAOwner(uint256 dcaId) {
        require(dcaOrders[dcaId].user == msg.sender, "Not DCA owner");
        _;
    }

    modifier onlyRouteOwner(uint256 routeId) {
        require(yieldRoutes[routeId].user == msg.sender, "Not route owner");
        _;
    }

    modifier onlyOrderOwner(uint256 orderId) {
        require(limitOrders[orderId].user == msg.sender, "Not order owner");
        _;
    }

    /**
     * @dev Create a DCA (Dollar Cost Averaging) order
     */
    function createDCA(
        address tokenIn,
        address tokenOut,
        uint256 amount,
        uint256 frequency
    ) external nonReentrant returns (uint256) {
        require(amount >= MIN_DCA_AMOUNT, "Amount too small");
        require(frequency >= 3600, "Frequency too low"); // Minimum 1 hour
        require(tokenIn != tokenOut, "Same token");

        _dcaCounter.increment();
        uint256 dcaId = _dcaCounter.current();

        dcaOrders[dcaId] = DCA({
            user: msg.sender,
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            amount: amount,
            frequency: frequency,
            lastExecution: 0,
            startTime: block.timestamp,
            isActive: true,
            totalExecutions: 0,
            totalAmountIn: 0,
            totalAmountOut: 0
        });

        userDCAs[msg.sender].push(dcaId);

        emit DCACreated(msg.sender, dcaId, tokenIn, tokenOut, amount, frequency, block.timestamp);
        return dcaId;
    }

    /**
     * @dev Execute DCA order (can be called by anyone)
     */
    function executeDCA(uint256 dcaId) external nonReentrant {
        DCA storage dca = dcaOrders[dcaId];
        require(dca.isActive, "DCA not active");
        require(block.timestamp >= dca.lastExecution + dca.frequency, "Too early");

        // Transfer tokens from user
        IERC20(dca.tokenIn).safeTransferFrom(dca.user, address(this), dca.amount);

        // Calculate swap amount (simplified - would use DEX in production)
        uint256 amountOut = _calculateSwapAmount(dca.tokenIn, dca.tokenOut, dca.amount);

        // Transfer tokens to user
        IERC20(dca.tokenOut).safeTransfer(dca.user, amountOut);

        // Update DCA stats
        dca.lastExecution = block.timestamp;
        dca.totalExecutions++;
        dca.totalAmountIn += dca.amount;
        dca.totalAmountOut += amountOut;

        emit DCAExecuted(dcaId, dca.user, dca.amount, amountOut, block.timestamp);
    }

    /**
     * @dev Create yield optimization route
     */
    function createYieldRoute(
        address[] memory tokens,
        uint256[] memory allocations,
        uint256 targetAPY
    ) external returns (uint256) {
        require(tokens.length == allocations.length, "Length mismatch");
        require(tokens.length > 0, "Empty route");

        uint256 totalAllocation = 0;
        for (uint256 i = 0; i < allocations.length; i++) {
            totalAllocation += allocations[i];
        }
        require(totalAllocation == 10000, "Allocations must sum to 100%");

        _yieldCounter.increment();
        uint256 routeId = _yieldCounter.current();

        yieldRoutes[routeId] = YieldRoute({
            user: msg.sender,
            tokens: tokens,
            allocations: allocations,
            targetAPY: targetAPY,
            currentAPY: 0,
            lastOptimization: block.timestamp,
            isActive: true,
            totalValue: 0
        });

        userYieldRoutes[msg.sender].push(routeId);

        emit YieldRouteCreated(msg.sender, routeId, tokens, allocations, targetAPY);
        return routeId;
    }

    /**
     * @dev Optimize yield route (autonomous)
     */
    function optimizeYieldRoute(uint256 routeId) external {
        YieldRoute storage route = yieldRoutes[routeId];
        require(route.isActive, "Route not active");

        uint256 oldAPY = route.currentAPY;
        uint256 newAPY = _calculateOptimalYield(route.tokens, route.allocations);

        if (newAPY > oldAPY + YIELD_OPTIMIZATION_THRESHOLD) {
            // Execute rebalancing
            _rebalanceYieldRoute(routeId);
            route.currentAPY = newAPY;
            route.lastOptimization = block.timestamp;

            emit YieldOptimized(routeId, route.user, oldAPY, newAPY, block.timestamp);
        }
    }

    /**
     * @dev Place limit order
     */
    function placeLimitOrder(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 price,
        bool isBuy
    ) external nonReentrant returns (uint256) {
        require(amountIn > 0, "Amount must be positive");
        require(price > 0, "Price must be positive");
        require(tokenIn != tokenOut, "Same token");

        _orderCounter.increment();
        uint256 orderId = _orderCounter.current();

        limitOrders[orderId] = LimitOrder({
            user: msg.sender,
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            amountIn: amountIn,
            price: price,
            isBuy: isBuy,
            timestamp: block.timestamp,
            isActive: true,
            filledAmount: 0
        });

        userLimitOrders[msg.sender].push(orderId);

        // Transfer tokens to contract
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);

        emit LimitOrderPlaced(msg.sender, orderId, tokenIn, tokenOut, amountIn, price, isBuy);
        return orderId;
    }

    /**
     * @dev Execute limit order (can be called by anyone)
     */
    function executeLimitOrder(uint256 orderId) external nonReentrant {
        LimitOrder storage order = limitOrders[orderId];
        require(order.isActive, "Order not active");

        uint256 currentPrice = _getCurrentPrice(order.tokenIn, order.tokenOut);
        bool shouldExecute = order.isBuy ? 
            currentPrice <= order.price : 
            currentPrice >= order.price;

        if (shouldExecute) {
            uint256 remainingAmount = order.amountIn - order.filledAmount;
            uint256 amountOut = _calculateSwapAmount(order.tokenIn, order.tokenOut, remainingAmount);

            // Transfer tokens
            IERC20(order.tokenOut).safeTransfer(order.user, amountOut);
            order.filledAmount = order.amountIn;
            order.isActive = false;

            emit LimitOrderExecuted(orderId, order.user, remainingAmount, amountOut, currentPrice);
        }
    }

    /**
     * @dev Create automated payment
     */
    function createAutomatedPayment(
        address to,
        uint256 amount,
        uint256 frequency
    ) external returns (uint256) {
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be positive");
        require(frequency >= 3600, "Frequency too low");

        _paymentCounter.increment();
        uint256 paymentId = _paymentCounter.current();

        automatedPayments[paymentId] = AutomatedPayment({
            from: msg.sender,
            to: to,
            amount: amount,
            frequency: frequency,
            lastPayment: 0,
            startTime: block.timestamp,
            isActive: true,
            totalPayments: 0
        });

        userPayments[msg.sender].push(paymentId);

        return paymentId;
    }

    /**
     * @dev Execute automated payment
     */
    function executeAutomatedPayment(uint256 paymentId) external nonReentrant {
        AutomatedPayment storage payment = automatedPayments[paymentId];
        require(payment.isActive, "Payment not active");
        require(block.timestamp >= payment.lastPayment + payment.frequency, "Too early");

        // Transfer ETH (simplified - could be any token)
        (bool success, ) = payment.to.call{value: payment.amount}("");
        require(success, "Payment failed");

        payment.lastPayment = block.timestamp;
        payment.totalPayments++;

        emit AutomatedPayment(payment.from, payment.to, payment.amount, paymentId, block.timestamp);
    }

    /**
     * @dev Create evolving NFT
     */
    function createEvolvingNFT() external returns (uint256) {
        _nftCounter.increment();
        uint256 tokenId = _nftCounter.current();

        evolvingNFTs[tokenId] = EvolvingNFT({
            user: msg.sender,
            level: 1,
            experience: 0,
            lastEvolution: block.timestamp,
            metadata: "Initial NFT",
            exists: true
        });

        userNFTs[msg.sender] = tokenId;

        return tokenId;
    }

    /**
     * @dev Evolve NFT based on performance
     */
    function evolveNFT(uint256 tokenId, uint256 performance) external {
        EvolvingNFT storage nft = evolvingNFTs[tokenId];
        require(nft.exists, "NFT not found");
        require(nft.user == msg.sender, "Not NFT owner");

        uint256 oldLevel = nft.level;
        uint256 experienceGain = performance / 100; // Convert performance to experience
        nft.experience += experienceGain;

        // Level up logic
        uint256 newLevel = 1 + (nft.experience / 1000);
        if (newLevel > oldLevel) {
            nft.level = newLevel;
            nft.lastEvolution = block.timestamp;
            nft.metadata = string(abi.encodePacked("Level ", newLevel.toString(), " NFT"));

            emit NFTEvolved(msg.sender, tokenId, oldLevel, newLevel, "Performance");
        }
    }

    /**
     * @dev Set up liquidation protection
     */
    function setupLiquidationProtection(uint256 protectionAmount) external {
        liquidationProtections[msg.sender] = LiquidationProtection({
            user: msg.sender,
            collateralValue: 0,
            debtValue: 0,
            protectionAmount: protectionAmount,
            lastCheck: block.timestamp,
            isProtected: false
        });
    }

    /**
     * @dev Check and protect against liquidation
     */
    function checkLiquidationProtection() external {
        LiquidationProtection storage protection = liquidationProtections[msg.sender];
        require(protection.user == msg.sender, "No protection set");

        // Calculate current ratios (simplified)
        uint256 collateralRatio = (protection.collateralValue * 100) / protection.debtValue;

        if (collateralRatio < LIQUIDATION_THRESHOLD) {
            // Execute protection measures
            _executeLiquidationProtection(msg.sender, protection.protectionAmount);
            protection.isProtected = true;
            protection.lastCheck = block.timestamp;

            emit LiquidationProtected(msg.sender, protection.collateralValue, protection.debtValue, protection.protectionAmount);
        }
    }

    // Internal functions
    function _calculateSwapAmount(address tokenIn, address tokenOut, uint256 amountIn) internal view returns (uint256) {
        // Simplified calculation - would use DEX in production
        return amountIn * 95 / 100; // 5% fee
    }

    function _calculateOptimalYield(address[] memory tokens, uint256[] memory allocations) internal view returns (uint256) {
        // Simplified yield calculation
        return 1200; // 12% APY
    }

    function _rebalanceYieldRoute(uint256 routeId) internal {
        // Simplified rebalancing logic
    }

    function _getCurrentPrice(address tokenIn, address tokenOut) internal view returns (uint256) {
        // Simplified price fetch - would use oracle in production
        return 1000000; // $1.00
    }

    function _executeLiquidationProtection(address user, uint256 amount) internal {
        // Simplified protection logic
    }

    // View functions
    function getUserDCAs(address user) external view returns (uint256[] memory) {
        return userDCAs[user];
    }

    function getUserYieldRoutes(address user) external view returns (uint256[] memory) {
        return userYieldRoutes[user];
    }

    function getUserLimitOrders(address user) external view returns (uint256[] memory) {
        return userLimitOrders[user];
    }

    function getUserPayments(address user) external view returns (uint256[] memory) {
        return userPayments[user];
    }

    function getDCAStats(uint256 dcaId) external view returns (
        uint256 totalExecutions,
        uint256 totalAmountIn,
        uint256 totalAmountOut
    ) {
        DCA storage dca = dcaOrders[dcaId];
        return (dca.totalExecutions, dca.totalAmountIn, dca.totalAmountOut);
    }

    // Emergency functions
    function cancelDCA(uint256 dcaId) external onlyDCAOwner(dcaId) {
        dcaOrders[dcaId].isActive = false;
    }

    function cancelLimitOrder(uint256 orderId) external onlyOrderOwner(orderId) {
        LimitOrder storage order = limitOrders[orderId];
        order.isActive = false;
        
        // Return remaining tokens
        uint256 remaining = order.amountIn - order.filledAmount;
        if (remaining > 0) {
            IERC20(order.tokenIn).safeTransfer(order.user, remaining);
        }
    }

    function cancelAutomatedPayment(uint256 paymentId) external {
        AutomatedPayment storage payment = automatedPayments[paymentId];
        require(payment.from == msg.sender, "Not payment owner");
        payment.isActive = false;
    }

    // Receive ETH
    receive() external payable {}
} 