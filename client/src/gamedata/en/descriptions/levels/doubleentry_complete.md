Congratulations !

This is the first experience you have with a [Forta's agent](https://docs.forta.network/en/latest/). 

Forta agents help you in monitoring specific things happening in the blockchain and that have an implementation which is executed everytime they are triggered. Forta agents are really useful for monitoring live blockchain events and might help newer protocols into implementing reactive strategies. 

The presented example is just for educational purpose since Forta agents are not modeled into smart contracts. This level showcases how they can be defeated if the system depends on an upgradeable contract that might remove agent's observed events.

If there are contracts which are upgradeable and that might break your specific agent, you can even create a specific agent to look for contract  upgrades and react to it. Learn how to do it [here](https://docs.forta.network/en/latest/quickstart/).

But you have also passed to a recent security issue that has been uncovered during our latest [collaboration with Compound protocol](https://compound.finance/governance/proposals/76).

Having tokens that present double entry point is a non trivial pattern that might affect many protocols. This is because is commonly assumed invariant to have one contract per token. But it was not the case this time :) You can read the entire details of what happened [here](https://blog.openzeppelin.com/compound-tusd-integration-issue-retrospective/).