Solidity에서는 컨트랙트가 이더(ether)를 받을 수 있으려면, 폴백(fallback) 함수가 `payable`로 표시되어야 합니다.

하지만 공격자가 자기 파괴(self-destruct)를 통해 컨트랙트에 이더를 강제로 보내는 것을 막을 방법은 없습니다. 따라서 컨트랙트 로직에서 `address(this).balance == 0`이라는 불변조건(invariant)에 의존하지 않는 것이 중요합니다.
