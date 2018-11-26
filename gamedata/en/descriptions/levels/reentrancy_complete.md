Use `transfer` to move funds out of your contract, since it `throw`s and limits gas forwarded. Low level functions like `call` and `send` just return false but don't interrupt the execution flow when the receiving contract fails.

Always assume that the receiver of the funds you are sending can be another contract, not just a regular address. Hence, it can execute code in its payable fallback method and *re-enter* your contract, possibly messing up your state/logic.

Re-entrancy is a common attack. You should always be prepared for it!

&nbsp;
#### The DAO Hack

The famous DAO hack used reentrancy to extract a huge amount of ether from the victim contract. See [15 lines of code that could have prevented TheDAO Hack](https://blog.zeppelin.solutions/15-lines-of-code-that-could-have-prevented-thedao-hack-782499e00942).
