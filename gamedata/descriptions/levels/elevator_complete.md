Currently, the Solidity compiler does nothing to enforce that a `view` or `constant` function is not modifying state. The same applies to `pure` functions, which should not read state but they can.
Make sure you read [Solidity's documentation](http://solidity.readthedocs.io/en/develop/contracts.html#view-functions) and learn its caveats.

An alternative way to solve this level is to build a view function which returns different results depends on input data but don't modify state, e.g. `gasleft()`.