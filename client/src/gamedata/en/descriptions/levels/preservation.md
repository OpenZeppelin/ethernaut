This contract utilizes a library to store two different times for two different
timezones. The constructor creates two instances of the library for each time
to be stored. 

The goal of this level is for you to claim ownership of the instance you are given.

&nbsp; Things that might help
* Look into Solidity's documentation on the `delegatecall` low level function,
  how it works, how it can be used to delegate operations to on-chain.
  libraries, and what implications it has on execution scope.
* Understanding what it means for `delegatecall` to be context-preserving. 
* Understanding how storage variables are stored and accessed. 
* Understanding how casting works between different data types. 
