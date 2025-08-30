`Stake`는 네이티브 ETH와 ERC20 WETH를 스테이킹하는 데 안전하며, 두 토큰은 동일한 1:1 가치를 가집니다. 이 컨트랙트의 자금을 고갈시킬 수 있을까요?

이 레벨을 완료하려면, 컨트랙트의 상태가 다음 조건들을 만족해야 합니다:

- `Stake` 컨트랙트의 ETH 잔액은 0보다 커야 합니다.
- `totalStaked`는 `Stake` 컨트랙트의 ETH 잔액보다 커야 합니다.
- 당신은 스테이커(staker)여야 합니다.
- 당신의 스테이킹된 잔액은 0이어야 합니다.

유용한 정보:

- [ERC-20](https://github.com/ethereum/ercs/blob/master/ERCS/erc-20.md) 명세
- [OpenZeppelin contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)
