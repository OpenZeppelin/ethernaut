// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract OrderBook {
    using SafeMath for uint256;
    
    event TokenWhitelisted(
        address indexed token,
        uint256 index
    );

    event OrderFilled (
        address indexed user,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );

    event OrderPlaced(
        address user,
        uint256 tokenInIndex,
        uint256 tokenOutIndex,
        uint256 amountIn,
        uint256 amountOut,
        uint256 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    );

    event Deposit(
        address indexed user,
        address indexed token,
        uint256 amount
    );

    event Withdraw(
        address indexed user,
        address indexed token,
        uint256 amount
    );

    struct VerifiedSignature {
        address signer;
        bytes32 sigHash;
        bytes32 orderHash;
    }

    struct Order {
        address user;
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 amountOut;
    }

    /// @dev a token index of zero means the token is not whitelisted
    mapping(address => uint256) tokenIndex;

    // every token pair has it's own order book
    // users want to sell tokenIn and buy tokenOut
    // [tokenIn][tokenOut][amountIn][amountOut] => array of pending orders that match
    mapping(address => mapping(address => mapping(uint256 => mapping(uint256 => Order[])))) newOrderBook;

    // record when an order signature is used, so that it cannot be used again
    mapping(bytes32 => bool) private _usedSignatures;

    // tracks user => token => available balances
    // (deposited balances that are not associated with an order)
    mapping(address => mapping(address => uint256)) private _balancesAvailable;

    // tracks user => token => reserved balances
    // (balances that are no longer available for withdrawal while associated with a pending order)
    mapping(address => mapping(address => uint256)) private _balancesReserved;

    // since the scenario is a closed system, we need to mock "external" balances
    mapping(address => mapping(address => uint256)) private _balancesExternal;

    // array of all tokens that have been whitelisted
    address[] private _whitelistedTokens;

    // contract deployer becomes the owner of the contract, non-transferable
    address private _owner;

    function initialize() external {
        require(_owner == address(0));
        _owner = msg.sender;

        // the 0th item is a placeholder, just to make mapping results more straightforward
        _whitelistedTokens.push(address(0));
    }

    /**
     * Allow only the owner of the contract to deposit on behalf of any user
     * @dev Added only to facilitate Ethernaut scenario setup
     * @param user to deposit on behalf of
     * @param token that is being deposited
     * @param amount of token that should be deposited for the user
     */
    function depositOnBehalfOf(
        address user,
        address token,
        uint256 amount
    ) external {
        require(_owner == msg.sender, "Only owner");
        require(
            isTokenWhitelisted(address(token)),
            "Cannot deposit a token that has not been whitelisted"
        );
        _deposit(user, token, amount);
    }

    /**
     * Allow only the owner of the order book to whitelist tokens for trading
     */
    function whitelistToken(address newToken) external {
        require(_owner == msg.sender, "Only owner");
        require(tokenIndex[newToken] == 0, "Token already whitelisted");

        // add the token to the list of whitelisted tokens
        uint256 newIndex = _whitelistedTokens.length;
        tokenIndex[newToken] = newIndex;
        _whitelistedTokens.push(newToken);

        emit TokenWhitelisted(newToken, newIndex);
    }

    /**
     * @return array of all whitelisted tokens
     */
    function getWhitelistedTokens() public view returns (address[] memory) {
        // the first item in our private list is a placeholder, so we want to skip it
        uint256 whitelistedTokensLength = _whitelistedTokens.length - 1;

        address[] memory whitelistedTokens = new address[](
            whitelistedTokensLength
        );

        // construct a new array skipping over the first element in our private array
        for (uint256 i = 0; i < whitelistedTokensLength; i++) {
            whitelistedTokens[i] = _whitelistedTokens[i + 1];
        }

        return whitelistedTokens;
    }

    /**
     * @param token to check for whitelist status
     * @return whether or not the token is whitelisted
     */
    function isTokenWhitelisted(address token) public view returns (bool) {
        return tokenIndex[token] != 0;
    }

    /**
     * Allow users to deposit whitelisted erc20 tokens into their own order book accounts
     * @param token that the msg.sender wishes to deposit into their account on the order book
     * @param amount the amount of token to deposit
     */
    function deposit(address token, uint256 amount) external {
        require(
            isTokenWhitelisted(address(token)),
            "Cannot deposit a token that has not been whitelisted"
        );
        _transferInFromUser(msg.sender, token, amount);
        _deposit(msg.sender, token, amount);
    }

    /**
     * Allow users to withdraw erc20 tokens from their own order book accounts
     * @param token the msg.sender wants to withdraw from their account on the order book
     * @param amount how much token the msg.sender wants to withdraw
     */
    function withdraw(address token, uint256 amount) external {
        _decreaseAvailableBalance(msg.sender, token, amount);
        _increaseExternalBalance(msg.sender, token, amount);
        emit Withdraw(msg.sender, token, amount);
    }

    /**
     * Accept signed orders and put them on the order book
     * @param user that the order will be placed on behalf of
     * @param tokenInIndex is the index of the whitelisted token that user wants to trade
     * @param tokenOutIndex is the index of the whitelisted token that user wants to trade for
     * @param amountIn the amount of tokenIn that user wants to trade
     * @param amountOut the amount of tokenOut that user would accept for trade
     * @param nonce number that should only be used once for message signing
     * @param v signature component
     * @param r signature component
     * @param s signature component
     */
    function placeOrder(
        address user,
        uint256 tokenInIndex,
        uint256 tokenOutIndex,
        uint256 amountIn,
        uint256 amountOut,
        uint256 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        require(
            tokenInIndex > 0 && tokenInIndex < _whitelistedTokens.length,
            "TokenIn index out of bounds"
        );

        require(
            tokenOutIndex > 0 && tokenOutIndex < _whitelistedTokens.length,
            "TokenOut index out of bounds"
        );

        // token indices are in the right range, so get the actual tokens
        address tokenIn = address(_whitelistedTokens[tokenInIndex]);
        address tokenOut = address(_whitelistedTokens[tokenOutIndex]);

        require(tokenIn != tokenOut, "Must trade across different tokens");
        require(amountIn != 0 && amountOut != 0, "Cannot trade a zero value");
        require(
            amountIn <= _balancesAvailable[user][tokenIn],
            "Order amount bid exceeds available user balance"
        );

        VerifiedSignature memory verifiedSignature = _verifyOrderSignature(
            user,
            tokenInIndex,
            tokenOutIndex,
            amountIn,
            amountOut,
            nonce,
            v,
            r,
            s
        );

        require(verifiedSignature.signer != address(0), "Invalid signature");
        require(
            verifiedSignature.signer == user,
            "Order signer does not match user specified in order"
        );
        require(
            _usedSignatures[verifiedSignature.sigHash] == false,
            "Order associated with signature already used"
        );

        // signature is "used" when the order is added to the order book
        _usedSignatures[verifiedSignature.sigHash] = true;

        emit OrderPlaced(
            user,
            tokenInIndex,
            tokenOutIndex,
            amountIn,
            amountOut,
            nonce,
            v,
            r,
            s
        );

        // user request is legit, convert it to a live order
        Order memory order = Order({
            user: user,
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            amountIn: amountIn,
            amountOut: amountOut
        });

        // after receiving valid order, try to fill it
        bool orderFilled = _fillOrder(order);

        // if it cannot be filled, then add it to the order book
        if (orderFilled) {
            emit OrderFilled(user, tokenIn, tokenOut, amountIn, amountOut);
        } else {
            _addOrder(order);
        }
    }

    /**
     * Get the total balance that the user has inside the order book
     * @param user for balance inquiry
     * @param token for balance inquiry
     */
    function getTotalBalance(address user, address token)
        external
        view
        returns (uint256)
    {
        return
            _balancesAvailable[user][token].add(_balancesReserved[user][token]);
    }

    /**
     * Get the available balance that is not associated with an outstanding order
     * @param user for balance inquiry
     * @param token for balance inquiry
     */
    function getAvailableBalance(address user, address token)
        external
        view
        returns (uint256)
    {
        return _balancesAvailable[user][token];
    }

    /**
     * Get the reserved balance that is associated with an outstanding order
     * @param user for balance inquiry
     * @param token for balance inquiry
     */
    function getReservedBalance(address user, address token)
        external
        view
        returns (uint256)
    {
        return _balancesReserved[user][token];
    }

        /**
     * Get the total balance that the user has inside the order book
     * @param user for balance inquiry
     * @param token for balance inquiry
     */
    function getExternalBalance(address user, address token)
        external
        view
        returns (uint256)
    {
        return
            _balancesExternal[user][token].add(_balancesReserved[user][token]);
    }

    // super simple, add new order to the end of the relevant "book"
    function _addOrder(Order memory order) private {
        Order[] storage orderBook = newOrderBook[order.tokenIn][order.tokenOut][
            order.amountIn
        ][order.amountOut];

        // reserved balances will go up, available balances will go down
        _increaseReserveBalance(order.user, order.tokenIn, order.amountIn);
        _decreaseAvailableBalance(order.user, order.tokenIn, order.amountIn);

        orderBook.push(order);
    }

    function _fillOrder(Order memory order) private returns (bool) {
        Order[] storage orderBook = newOrderBook[order.tokenOut][order.tokenIn][
            order.amountOut
        ][order.amountIn];
        // there is a matching counter order
        if (orderBook.length > 0) {
            Order memory matchingOrder = orderBook[0];

            // delete the oldest order by shifting everything left and deleting the end
            for (uint256 i = 0; i < orderBook.length - 1; i++) {
                orderBook[i] = orderBook[i + 1];
            }
            orderBook.pop();

            // user that submitted order will decrease available balance of tokenIn
            // and increase available balance of tokenOut
            _decreaseAvailableBalance(
                order.user,
                order.tokenIn,
                order.amountIn
            );
            _increaseAvailableBalance(
                order.user,
                order.tokenOut,
                order.amountOut
            );

            // user with standing order will have their tokenIn reserve balance decrease
            // but their available balance of their tokenOut will increase
            _decreaseReserveBalance(
                matchingOrder.user,
                matchingOrder.tokenIn,
                matchingOrder.amountIn
            );
            _increaseAvailableBalance(
                matchingOrder.user,
                matchingOrder.tokenOut,
                matchingOrder.amountOut
            );

            emit OrderFilled(
                order.user,
                order.tokenIn,
                order.tokenOut,
                order.amountIn,
                order.amountOut
            );

            return true;
        } else {
            // no matching order was found
            return false;
        }
    }

    function _verifyOrderSignature(
        address user,
        uint256 tokenInIndex,
        uint256 tokenOutIndex,
        uint256 amountIn,
        uint256 amountOut,
        uint256 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) private pure returns (VerifiedSignature memory) {
        bytes32 userOrderHash = keccak256(
            abi.encode(
                user,
                tokenInIndex,
                tokenOutIndex,
                amountIn,
                amountOut,
                nonce
            )
        );
        bytes32 msgHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", userOrderHash)
        );
        bytes32 sigHash = keccak256(abi.encodePacked(r, s, v));

        address signer = ecrecover(msgHash, v, r, s);

        return VerifiedSignature(signer, sigHash, userOrderHash);
    }

    function _transferInFromUser(
        address user,
        address token,
        uint256 amount
    ) private {
        _decreaseExternalBalance(user, token, amount);
    }

    function _deposit(address user, address token, uint256 amount) private {
        _increaseAvailableBalance(user, token, amount);
        emit Deposit(user, token, amount);
    }

    function _increaseAvailableBalance(
        address user,
        address token,
        uint256 amount
    ) private {
        _balancesAvailable[user][token] = _balancesAvailable[user][token].add(amount);
    }

    function _decreaseAvailableBalance(
        address user,
        address token,
        uint256 amount
    ) private {
        _balancesAvailable[user][token] = _balancesAvailable[user][token].sub(amount);
    }

    function _increaseReserveBalance(
        address user,
        address token,
        uint256 amount
    ) private {
        _balancesReserved[user][token] = _balancesReserved[user][token].add(amount);
    }

    function _decreaseReserveBalance(
        address user,
        address token,
        uint256 amount
    ) private {
        _balancesReserved[user][token] = _balancesReserved[user][token].sub(amount);
    }

    function _increaseExternalBalance(
        address user,
        address token,
        uint256 amount
    ) private {
        _balancesExternal[user][token] = _balancesExternal[user][token].add(amount);
    }

    function _decreaseExternalBalance(
        address user,
        address token,
        uint256 amount
    ) private {
        _balancesExternal[user][token] = _balancesExternal[user][token].sub(amount);
    }



    // the function below is used only to set up the scenario
    function setupScenario() external {

        require(msg.sender == _owner);

        ///Setup trades
        placeOrder(0xE3EeaDaD850BCf71390961945d3Bae854C41d276, 1, 3, 10000000000000000000, 35000000000000000000, 1, 27, 0x796fb77f8f449caf9fa32c4241f8c08f67b6115aad013ab4054f21f08d595d0a, 0x1536fa7a5528b563c1180b0e22562754068e417173d270f41583cde1747f63c5);
        placeOrder(0xb9a9B73CE551c06EEA59143B9BEdaA8195F517FF, 1, 3, 10000000000000000000, 35000000000000000000, 1, 28, 0xda654da61dd9c44f0f51fa81befd225261451a71114826fa067661b09023fafb, 0x30936a5bd7e2cdf7719c9aef514124e4285b0e752a4ed28e147d3340e114ba93);
        placeOrder(0xE3EeaDaD850BCf71390961945d3Bae854C41d276, 2, 3, 45000000000000000000, 65000000000000000000, 2, 27, 0x807347916985693a9953efbe480f7114decfae746f9c98495c1372601194b130, 0x75acb4c862172d07487add961c604fb1294385bee27b45fed95c9b521b5b0198);
        placeOrder(0xf8f398e1b3Be169f4A1aEA3553ad8c3550B58a5d, 1, 2, 15000000000000000000, 40000000000000000000, 1, 28, 0xee56a323e26efd80a101f2db48c4808ce49f92da90b72ff6fe0ad91c3b6a3987, 0x7405b790af41fc2cbefc0f96a5cec62f80bcc639d392a2580cc13af765160c69);
        placeOrder(0xF0902f8573acfD685978450Bc2485c002471D4B0, 2, 1, 45000000000000000000, 15000000000000000000, 1, 27, 0xd1c2f516e1cfd12b20b7b3bd1fc2e2a3e1a84d1c68dc95f0e53149a4b23165d3, 0x69983ccdc22751e74d18310d9dc526d8059fb88b675cf03a363a407ab59f2657);
        placeOrder(0xF0902f8573acfD685978450Bc2485c002471D4B0, 3, 1, 55000000000000000000, 20000000000000000000, 2, 28, 0x3c3ad10607ffd06a1cf8b90c051e2597f780cc0466f1e619e5177f0e805909bb, 0x70c72727a27d60a2b2f8dfdb3787408d8852eab1aa60d8d886a091f3ceb9725b);
        placeOrder(0xb9a9B73CE551c06EEA59143B9BEdaA8195F517FF, 3, 2, 100000000000000000000, 80000000000000000000, 2, 28, 0x303491a774261f8aff19a3e963ac4ad70a81751f6fc2b40d3a65b4a538a2f4c1, 0x18a892cd45a22eb91b7c5393c7bce3e8a56ba3328d8531e108a5ecccb16c0d52);
        placeOrder(0x421244A7A8809c73a9D6806b91E322c85e9574df, 1, 2, 15000000000000000000, 45000000000000000000, 1, 27, 0xd4d3f754d33c10d935e7c50c112e97ea4040333829eb5c90a337ef6c4f7d3a6c, 0x4ea451d00c9eb3d17752d7bd08a321c8db38da0e6aaef088dad3edc669295ae1);
        placeOrder(0x421244A7A8809c73a9D6806b91E322c85e9574df, 2, 3, 80000000000000000000, 100000000000000000000, 2, 27, 0xc19b651dfd49b573eeb4e643e2551d862a8bf85737fbf38293ef8210ebe9c7a8, 0x1ec2df1020c9ab7102fae8affca82522eca388fa627374c1699fa3250213c534);
        placeOrder(0x421244A7A8809c73a9D6806b91E322c85e9574df, 3, 1, 35000000000000000000, 10000000000000000000, 3, 27, 0x1036d281926e4a2b4d173ee2b3dfc90a21fd7b56b90c448108aced34e873e81f, 0x563eb8893d741a3a0de1ce5710ba1f0ba25426cb05fc36c2bcfeeb040faab0c5);
        placeOrder(0xE3EeaDaD850BCf71390961945d3Bae854C41d276, 1, 3, 20000000000000000000, 55000000000000000000, 3, 28, 0x6be7be29bc95413cbfeba734e309d70ab203110c1988029b117418126bb8c91c, 0x0f8a5caaee09baf6247353d66ced59ce0ec534d3817397b2f60d1f8869c4bbb9);
        placeOrder(0xE3EeaDaD850BCf71390961945d3Bae854C41d276, 1, 3, 20000000000000000000, 55000000000000000000, 4, 28, 0x4bd75675db408eda4a5b9335f34f49a1ec5e42ca29ba01331b2acba983fb0449, 0x7bd35f2193e9293203fb1c32042581c273ddb57ce540d5faf91d131c5b167d99);
        placeOrder(0xb9a9B73CE551c06EEA59143B9BEdaA8195F517FF, 2, 1, 40000000000000000000, 15000000000000000000, 3, 27, 0x347b01aa24d1a1abcb184c06dfcddb35642f9d30b9094118773bc23a5a5840aa, 0x272a8fd029df047d72ae46755b34784ad02f71fc2cb6d25d787ac0312e7bab34);
        placeOrder(0xf8f398e1b3Be169f4A1aEA3553ad8c3550B58a5d, 1, 2, 35000000000000000000, 80000000000000000000, 2, 27, 0xa7910bae6403166b76f0855180f264202ab01458b574e00211e7d0c7c66b8690, 0x7a89cd54bed193cbce9a7634fcfac76eee7fd2afb10a2a5be292c5e075fa4221);
        placeOrder(0xE3EeaDaD850BCf71390961945d3Bae854C41d276, 2, 3, 30000000000000000000, 32000000000000000000, 5, 28, 0x2cf44235bfdf5701739720552e6fde0ae5ba90ebc62b82844b947af0dc0cc53b, 0x1b68e3f6e46d73e4d5a04b4215f6500d543cfbf12a09328c0303bf997c4176a6);
        placeOrder(0x421244A7A8809c73a9D6806b91E322c85e9574df, 3, 2, 70000000000000000000, 80000000000000000000, 4, 28, 0x1563d2fd843b778fdab9be9045ed32e1d8319cf95762740a0b026f159193c89b, 0x77b28cd62da14933761197660041e3150c894d1e16eb560be20a9de08e8fbe66);

    }
}
