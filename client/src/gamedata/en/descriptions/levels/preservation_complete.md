As the previous level, `delegate` mentions, the use of `delegatecall` to call
libraries can be risky. This is particularly true for contract libraries that
have their own state. This example demonstrates why the `library` keyword
should be used for building libraries, as it prevents the libraries from
storing and accessing state variables. 

