축하합니다! 당신은 `Stake` 머신을 뚫어냈습니다!

외부 컨트랙트에 low-level call을 수행할 때는, 호출이 성공했는지 여부를 반드시 확인해야 합니다. 그렇지 않으면 예상치 못한 리버트되지 않은 실패(silent failure)가 발생할 수 있습니다. 

보다 자세한 정보는 [EEA EthTrust [S] 외부 호출 반환 확인](https://entethalliance.github.io/eta-registry/security-levels-spec.html#req-1-check-return) 요구사항을 확인하시고, 외부 ERC-20토큰과 상호작용할 때는 항상 [SafeERC20](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/utils/SafeERC20.sol)을 사용하시기 바랍니다.