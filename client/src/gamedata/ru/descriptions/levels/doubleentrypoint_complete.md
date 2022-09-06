Congratulations!

This is the first experience you have with a [Forta bot](https://docs.forta.network/en/latest/). 

Forta comprises a decentralized network of independent node operators who scan all transactions and block-by-block state changes for outlier transactions and threats. When an issue is detected, node operators send alerts to subscribers of potential risks, which enables them to take action.

The presented example is just for educational purpose since Forta bot is not modeled into smart contracts. In Forta, a bot is a code script to detect specific conditions or events, but when an alert is emitted it does not trigger automatic actions - at least not yet. In this level, the bot's alert effectively trigger a revert in the transaction, deviating from the intended Forta's bot design.

Detection bots heavily depends on contract's final implementations and some might be upgradeable and break bot's integrations, but to mitigate that you can even create a specific bot to look for contract upgrades and react to it. Learn how to do it [here](https://docs.forta.network/en/latest/quickstart/).

You have also passed through a recent security issue that has been uncovered during OpenZeppelin's latest [collaboration with Compound protocol](https://compound.finance/governance/proposals/76).

Having tokens that present a double entry point is a non-trivial pattern that might affect many protocols. This is because it is commonly assumed to have one contract per token. But it was not the case this time :) You can read the entire details of what happened [here](https://blog.openzeppelin.com/compound-tusd-integration-issue-retrospective/).
