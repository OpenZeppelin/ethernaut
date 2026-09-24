A tiny DAO holds a small treasury, gated behind one rule: whoever calls `executeProposal` needs to hold at least 50% of the governance token's supply. You start with none of it, and neither buying nor being gifted that much is an option.

The governance token happens to support flash loans, charging the same 0.3% fee Uniswap V2 charges on a flash swap. You've been given a small starting balance, nowhere near enough to reach quorum by holding it outright.

Complete this level by draining the treasury.

&nbsp;
Things that might help
* What a flash loan actually guarantees: a balance for the duration of one transaction, nothing more
* Why real governance systems checkpoint voting power instead of reading `balanceOf()` live
* The fee isn't free: figure out where it has to come from before you borrow
* You'll need a contract for this one: a flash loan lender calls back into `msg.sender`, which only makes sense if there's code there to call
