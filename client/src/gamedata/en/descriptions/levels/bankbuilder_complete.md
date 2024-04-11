When the address of a contract to be deployed using method create or create2 is pre-known before it's deployment and the address have some funds stuck in it, the funds can be retrived back under some conditions. For create method the two pre-requists are address of deployer and nonce of current transaction, where as for create2 the pre-requists are contract's creation code, address of deployer and salt (arbitrary bytes32 data).

The base of challange is how create and create2 generates the contract's address. Please refer these relevent links:-

* [Create and Create2](https://medium.com/@coiiasd88/how-to-use-solidity-create-and-create2-792d22dbd573)

* [How address of a contract computed](https://ethereum.stackexchange.com/questions/760/how-is-the-address-of-an-ethereum-contract-computed)