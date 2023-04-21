恭喜！

这是您第一次使用 [Forta bot](https://docs.forta.network/en/latest/)。

Forta 包括一个由独立节点运营商组成的去中心化网络，他们扫描所有交易和逐块状态变化以查找异常交易和威胁。 当检测到问题时，节点运营商会向订阅者发送潜在风险警报，以便他们采取行动。

提供的示例仅用于教育目的，因为 Forta 机器人未建模到智能合约中。 在 Forta 中，机器人是检测特定条件或事件的代码脚本，但发出警报时它不会触发自动操作 - 至少现在不会。 在这一关卡，机器人的警报有效地触发了交易的 `revert`，偏离了预期的 Forta 机器人设计。

检测机器人在很大程度上取决于合约的最终设计，有些可能是可升级(upgradeable)与破坏(break)机器人的组合，但为了缓解这种情况，您甚至可以创建一个特定的机器人来寻找可升级合约并对其执行相应处理。 访问 [此处](https://docs.forta.network/en/latest/quickstart/) 了解如何操作。

您还可以查看 OpenZeppelin 最新的 [collaboration with Compound protocol](https://compound.finance/governance/proposals/76) 期间发现的安全问题。

具有呈现双重入口点的代币是一种可能影响许多协议的重要模式。 这是因为通常假设每个代币有一份合约。 但这次情况并非如此 :) 您可以在 [此处](https://blog.openzeppelin.com/compound-tusd-integration-issue-retrospective/) 阅读所发生事情的全部细节。