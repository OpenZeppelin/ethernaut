Solidity에서 컨트랙트가 이더를 수신하려면, fallback 함수에 `payable` 키워드가 있어야 합니다. 

하지만 `selfdestruct`를 이용하면, 공격자가 해당 컨트랙트로 강제로 이더를 전송할 수 있습니다. 따라서 어떤 컨트랙트 로직에서도 `address(this).balance == 0`이라는 조건을 절대적인 불변 조건(invariant)으로 신뢰해서는 안 됩니다.