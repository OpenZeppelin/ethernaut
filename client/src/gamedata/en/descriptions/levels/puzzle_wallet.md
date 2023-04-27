Nowadays, paying for DeFi operations is impossible, fact.

A group of friends discovered how to slightly decrease the cost of performing multiple transactions by batching them in one transaction, so they developed a smart contract for doing this. 

They needed this contract to be upgradeable in case the code contained a bug, and they also wanted to prevent people from outside the group from using it. To do so, they voted and assigned two people with special roles in the system:
The admin, which has the power of updating the logic of the smart contract.
The owner, which controls the whitelist of addresses allowed to use the contract.
The contracts were deployed, and the group was whitelisted. Everyone cheered for their accomplishments against evil miners.

Little did they know, their lunch money was at risk…

&nbsp;
You'll need to hijack this wallet to become the admin of the proxy.

&nbsp;
Things that might help:
* Understanding how `delegatecall` works and how `msg.sender` and `msg.value` behaves when performing one.
* Knowing about proxy patterns and the way they handle storage variables.
