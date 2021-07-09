This level demonstrates that external calls to unknown contracts can still
create denial of service attack vectors if a fixed amount of gas is not
specified.

If you are using a low level `call` to continue executing in the event an external call reverts, ensure that you specify a fixed gas stipend. For example `call.gas(100000).value()`.

Typically one should follow the [checks-effects-interactions](http://solidity.readthedocs.io/en/latest/security-considerations.html#use-the-checks-effects-interactions-pattern) pattern to avoid reentrancy attacks, there can be other circumstances (such as multiple external calls at the end of a function) where issues such as this can arise.

*Note*: An external `CALL` can use at most 63/64 of the gas currently available
at the time of the `CALL`.  Thus, depending on how much gas is required to
complete a transaction, a transaction of sufficiently high gas (i.e. one such
that 1/64 of the gas is capable of completing the remaining opcodes in the parent call) can be used to mitigate this particular attack.