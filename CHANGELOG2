# Ethernaut Vulnerability Fix PR

## 漏洞描述
原关卡合约存在重入攻击漏洞，攻击者可以在 `withdraw` 调用中再次调用自身函数，从而重复提取资金。

## 修复方案
- 添加 `noReentrant` 修饰器，防止在函数执行中再次进入。
- 先更新状态再发送以太币，符合 Checks-Effects-Interactions 模式。

## 部署
```bash
npm install
npx hardhat compile
npx hardhat test
```


