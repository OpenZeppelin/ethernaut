While hiding your solidity source code may slow down an attacker, it's important to remember that any public or external functions in your contract can be called, even without an ABI. 

The exact scenario of using unverified contracts may be uncommon, but any deployed contracts should be checked to ensure that the source code matches the deployed bytecode. In particular, [malicious functions can be injected post-audit and pre-deployment](https://cointelegraph.com/news/certik-dissects-the-axion-network-incident-and-subsequent-price-crash).
