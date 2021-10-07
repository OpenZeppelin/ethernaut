Next time, those friends will request an audit before depositing any money in the platform. Congrats!

It's frequent that the usage of proxy contracts to develop a project is highly recommended to bring upgradeability features and reducing the gas cost of the deployment. However, developers must be careful when using them to prevent [storage collisions](https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies#unstructured-storage-proxies) as it was seen in this level. Changing the order of the storage variables when upgrading from implementations could cause from minor problems up to breaking the entire protocol.

Furthermore, as it was seen, iterating over an actions that consumes ETH cannot be treated as you would do when using ERC20 tokens. That's so because `msg.value` is kept along all the execution and previous iterations in the loop could have used part of that ETH sent, resulting in the consumption of the protocol's ETH instead of the one provided/tracked by that user. In cases where this multi-call functionality must be used with ETH, the `msg.value` must be assign to a local variable and it should be subtracted the ETH used per iteration. If also it's being used the [OpenZeppelin's SafeMath library](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol) the transaction will revert when this value crosses the zero value, preventing anyone from using more that it should.

Please refer to the [OpenZeppelin's Proxies documentation](https://docs.openzeppelin.com/contracts/4.x/api/proxy) for an accurate description of how to use them in your project.

Move on to the next level when you're ready!
