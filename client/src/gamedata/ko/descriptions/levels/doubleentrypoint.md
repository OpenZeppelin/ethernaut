이 레벨은 특별한 기능인 `sweepToken` 함수를 가진 `CryptoVault`를 다룹니다. 이 함수는 일반적으로 컨트랙트에 묶여 있는 토큰을 복구하는 데 사용됩니다. `CryptoVault`는 `underlying` 토큰을 기반으로 작동합니다. 이 토큰은 `CryptoVault`의 핵심 로직 구성 요소이므로 스윕(sweep)할 수 없습니다. 다른 모든 토큰은 스윕할 수 있습니다.

`underlying` 토큰은 `DoubleEntryPoint` 컨트랙트 정의에 구현된 DET 토큰의 인스턴스이며, `CryptoVault`는 이 토큰을 100개 보유하고 있습니다. 또한 `CryptoVault`는 `LegacyToken LGT`도 100개 보유하고 있습니다.

이 레벨에서 당신은 `CryptoVault`의 버그를 찾아내어 토큰이 유출되지 않도록 보호해야 합니다.

이 컨트랙트는 모든 사용자가 자신만의 `detection bot` 컨트랙트를 등록할 수 있는 `Forta` 컨트랙트를 특징으로 합니다. Forta는 DeFi, NFT, 거버넌스, 브릿지 및 기타 Web3 시스템의 위협과 이상 징후를 최대한 빨리 탐지하기 위한 탈중앙화된 커뮤니티 기반 모니터링 네트워크입니다. 당신의 임무는 `detection bot`을 구현하여 `Forta` 컨트랙트에 등록하는 것입니다. 이 봇은 잠재적인 공격이나 버그 악용을 방지하기 위해 정확한 경고를 발생시켜야 합니다.

도움이 될 만한 것들:

- 토큰 컨트랙트의 이중 진입점(double entry point)은 어떻게 작동하나요?
