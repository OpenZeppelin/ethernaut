우리가 반복적으로 보아왔듯이, 컨트랙트 간의 상호작용은 예기치 않은 동작의 원인이 될 수 있습니다.

컨트랙트가 [ERC20 spec](https://eips.ethereum.org/EIPS/eip-20)을 구현했다고 주장한다고 해서, 그것이 신뢰할 수 있다는 의미는 아닙니다.

일부 토큰은 `transfer` 메서드에서 불리언(boolean) 값을 반환하지 않아 ERC20 사양을 벗어나기도 합니다. [Missing return value bug - At least 130 tokens affected](https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected-d67bf08521ca) 문서를 참조하세요.

다른 ERC20 토큰들, 특히 적대자에 의해 설계된 토큰들은 더 악의적으로 동작할 수 있습니다.

만약 중앙 기관의 허가 없이 누구나 자신의 토큰을 상장할 수 있는 DEX를 설계한다면, DEX의 정확성은 DEX 컨트랙트와 거래되는 토큰 컨트랙트 간의 상호작용에 따라 달라질 수 있습니다.
