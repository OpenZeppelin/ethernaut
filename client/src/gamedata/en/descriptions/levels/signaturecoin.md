This level involves an ERC20 token that allows holders to sign token transfers that anyone can submit on their behalf. In this way, the token holder doesn't need ETH to pay for gas. By reviewing the transaction history, you've noticed a completed call to

```solidity
transferWithSignature(
    0x3Dd8e463A4786CbE0AEFc88f6fD3fc08EeC39c0e,
    5000000000000000000, // 5e18
    1,
    0x3311019efd630afe231491d2afcfc626870880e99ff5907a814f55539bf1955f,
    0x08dcefa95e708b229636cfe4f952c87721daccd45248e0fd78e32b1ae5e33f21,
    27
)
```

This means the signer transferred 5 tokens to the recipient. Your challenge is to reduce the signer's balance even further.

Things that might help:

- The intention of this contract is similar to [EIP2612](https://eips.ethereum.org/EIPS/eip-2612)
- OpenZeppelin provides an [ECDSA library](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/ECDSA.sol)

Both of these references are more secure than `SignatureCoin`.