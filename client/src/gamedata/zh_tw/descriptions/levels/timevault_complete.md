此關卡展示了在智能合約中使用 `block.timestamp` 進行基於時間的存取控制的漏洞。

解決方案涉及理解礦工對區塊時間戳具有一定程度的控制權。雖然他們無法設定任意時間戳，但可以在一定範圍內（通常為實際時間的 ±15 秒）操縱它們。

在 Foundry 或 Hardhat 等測試環境中，您可以使用時間操縱函數（`vm.warp()` 或 `evm_increaseTime()`）來快進時間並立即繞過時間鎖。

對於安全的時間鎖實現，請考慮：
- 使用區塊號而非時間戳來獲得更可預測的時間
- 除了時間限制外，還要實施額外的存取控制
- 使用既定的時間鎖模式，如 OpenZeppelin 的 TimelockController
- 認識到區塊鏈上的所有資料都是公開的，包括「私有」變數

請參閱 [Consensys 智能合約最佳實踐](https://consensys.github.io/smart-contract-best-practices/development-recommendations/general/timestamp-dependence/) 以獲取有關時間戳依賴漏洞的更多資訊。