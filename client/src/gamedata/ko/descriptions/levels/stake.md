Stake 컨트랙트는 네이티브 ETH와 ERC20 WETH를 1:1 비율로 스테이킹할 수 있는 안전한 시스템입니다. 과연 이 컨트랙트를 고갈(drain)시킬 수 있을까요?

이 레벨을 완료하려면, 아래 조건을 모두 만족해야 합니다:

1) `Stake` 컨트랙트의 ETH 잔액이 0보다 커야 합니다.
2) `totalStaked` 값이 `Stake` 컨트랙트의 ETH 잔액보다 커야 합니다.
3) 당신은 staker로 등록되어 있어야 합니다.
4) 그러나 당신의 스테이킹 잔액은 0이어야 합니다.

도움이 될 만한 것들: 
- [ERC-20](https://github.com/ethereum/ercs/blob/master/ERCS/erc-20.md)표준 명세
- [OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts) 라이브러리