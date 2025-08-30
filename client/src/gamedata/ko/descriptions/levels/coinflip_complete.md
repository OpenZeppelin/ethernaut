Solidity 에서 난수를 생성하는 것은 까다로울 수 있습니다. 현재 난수를 생성하는 네이티브한 방법은 없으며, 스마트 컨트랙트에서 사용하는 private 로 표시된 지역 변수나 상태 변수를 포함한 모든 것은 공개됩니다. 또한 채굴자는 블록해시, 타임스탬프, 특정 트랜잭션의 포함 여부 등을 제어할 수 있으며, 자신에게 유리하도록 이 값들을 편향시킬 수 있습니다.

암호학적으로 증명된 난수를 얻으려면 [Chainlink VRF](https://docs.chain.link/docs/get-a-random-number)를 사용할 수 있습니다. 이 방법은 오라클, LINK 토큰, 온체인 컨트랙트를 사용하여 난수가 진정으로 무작위인지 검증합니다.

이 밖에도 [BTC Relay](http://btcrelay.org)로 검증하는 비트코인 블록 헤더를 이용하는 방법이나 [RANDAO](https://github.com/randao/randao), [Oraclize](http://www.oraclize.it/) 등의 선택지가 있습니다.
