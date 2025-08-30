축하합니다, 당신은 `Stake` 기계를 무너뜨렸습니다!

외부 컨트랙트에 대한 로우 레벨(low-level) 호출을 수행할 때는, 호출이 리버트(revert)되었는지 확인하기 위해 외부 호출의 반환 값을 올바르게 검증하는 것이 중요합니다.

더 자세한 정보는 [EEA EthTrust [S] Check External Calls Return](https://entethalliance.github.io/eta-registry/security-levels-spec.html#req-1-check-return) 요구 사항을 확인하고, 외부 ERC-20 토큰과 상호작용할 때는 항상 [SafeERC20](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/utils/SafeERC20.sol)을 사용하세요.
