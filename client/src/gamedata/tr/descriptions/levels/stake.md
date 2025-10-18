Stake kontratı, native ETH ve ERC20 WETH ile staking için güvenlidir; her iki token da 1:1 değer oranına sahiptir. Peki, kontratı boşaltabilir misin?

Bu seviyeyi tamamlamak için kontrat durumu aşağıdaki şartları sağlamalı:

- `Stake` kontratının ETH bakiyesi 0’dan büyük olmalı.
- `totalStaked`, `Stake` kontratının ETH bakiyesinden büyük olmalı.
- Bir staker olmalısın.
- Stake edilmiş bakiyen 0 olmalı.

Yardımcı olabilecek noktalar:

- [ERC-20](https://github.com/ethereum/ercs/blob/master/ERCS/erc-20.md) spesifikasyonu.
- [OpenZeppelin kontratları](https://github.com/OpenZeppelin/openzeppelin-contracts)
