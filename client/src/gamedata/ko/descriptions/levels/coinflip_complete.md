솔리디티에서 난수를 생성하는 건 까다롭습니다. 현재 네이티브 방식이 없으며, 스마트 컨트랙트에서 사용하는 모든 값은 로컬 변수와 `private`로 표시된 상태 변수까지 모두 공개됩니다. 채굴자들은 블록 해시(blockhash), 타임스탬프(timestamp), 특정 트랜잭션의 포함 여부 등을 제어할 수 있어 이 값을 자신들에게 유리하게 편향시킬 수 있습니다.

암호학적으로 검증된 난수를 얻으려면 [Chainlink VRF](https://docs.chain.link/docs/get-a-random-number)를 사용할 수 있습니다. 이 방식은 오라클, LINK 토큰, 온체인 컨트랙트를 활용해 난수가 진짜 무작위임을 검증합니다.

그 밖의 옵션으로는 비트코인 블록 헤더를 이용하는 방법(이를 [BTC Relay](http://btcrelay.org)로 검증), [RANDAO](https://github.com/randao/randao) 사용, 또는 [Oraclize](http://www.oraclize.it/) 활용 등이 있습니다.
