Congratulations !

This is the first experience you have with a [Forta's agent](https://docs.forta.network/en/latest/). 

The Forta Protocol has two main components – agents and nodes. Agents are scripts that look for certain transaction characteristics or state changes (e.g. anomaly detection) on smart contracts across any Layer 1, Layer 2, or sidechain. Nodes run agents against each block of transactions. When the agents detect a specific condition or event, the network emits an alert which is stored on IPFS and linked on a public blockchain. Forta also maintains an automated public registry of all alerts, and anyone interested in the security of a contract can consume relevant alerts via the explorer or API.

The presented example is just for educational purpose since Forta agents are not modeled into smart contracts. This level showcases how upgradeable contracts might cause agents to lose coverage over the contract.

If there are contracts which are upgradeable and that might break your specific agent, you can even create a specific agent to look for contract  upgrades and react to it. Learn how to do it [here](https://docs.forta.network/en/latest/quickstart/).

You have also passed through a recent security issue that has been uncovered during our latest [collaboration with Compound protocol](https://compound.finance/governance/proposals/76).

Having tokens that present double entry points is a non trivial pattern that might affect many protocols. This is because a commonly assumed invariant is to have one contract per token. It was not the case this time :) You can read the entire details of what happened [here](https://blog.openzeppelin.com/compound-tusd-integration-issue-retrospective/).
