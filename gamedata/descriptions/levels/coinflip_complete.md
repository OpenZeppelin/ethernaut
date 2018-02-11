Generating random numbers in solidity can be tricky. There currently isn't a native way to generate them, and everything you use in smart contracts is publicly visible, including the local variables and state variables marked as private. Miners also have control over things like blockhashes, timestamps, and whether to include certain transactions - which allows them to bias numbers in their favor. 

A simple option is to generate numbers off-chain using an API, such as [Oraclize](http://www.oraclize.it/). 

