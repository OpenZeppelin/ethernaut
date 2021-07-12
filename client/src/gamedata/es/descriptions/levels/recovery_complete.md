
Contract addresses are deterministic and are calculated by `keccack256(address, nonce)` where the `address` is the address of the contract (or ethereum address that created the transaction) and `nonce` is the number of contracts the spawning contract has created (or the transaction nonce, for regular transactions).  

Because of this, one can send ether to a pre-determined address (which has no private key) and later create a contract at that address which recovers the ether. This is a non-intuitive and somewhat secretive way to (dangerously) store ether without holding a private key. 

An interesting [blog post](http://martin.swende.se/blog/Ethereum_quirks_and_vulns.html) by Martin Swende details potential use cases of this. 

If you're going to implement this technique, make sure you don't miss the nonce, or your funds will be lost forever. 


