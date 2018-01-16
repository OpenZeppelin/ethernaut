This is not a bug or exploit per-se, but a non-intuitive way to (dangerously) store ether without holding a private key. 

Contract addresses are deterministic and thus, ether can be stored in addresses which can be created in the future in order to recover the funds. 

An interesting [blog post](http://martin.swende.se/blog/Ethereum_quirks_and_vulns.html) by Martin Swende details potential use cases of this. 

If you're going to implement this technique, make sure you don't miss the nonce, or your funds will be lost forever. 


