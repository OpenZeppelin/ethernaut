Thought `tx.origin == msg.sender` would save you from smart contract callers? Not anymore.

With EIP-7702, an EOA can slip into contract-like behavior, delegate calls, and sneak past that old check. The assumption that EOAs cannot reenter a function is now more dangerous than ever.

By reentering `mintNFTEOA` from the `onERC721Received` callback, you can mint as many NFTs as you want. Suddenly, one badge isn’t the limit, it’s just the beginning.