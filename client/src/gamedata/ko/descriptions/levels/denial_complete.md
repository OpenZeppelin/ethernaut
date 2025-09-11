이 레벨은 외부 컨트랙트로의 호출이 DoS(서비스 거부) 공격 백터가 될 수 있음을 보여줍니다. 특히 고정된 가스 한도 없이 외부 호출을 수행할 경우, 공격에 취약해질 수 있습니다. 

`call`을 사용할 때, 외부 호출이 실패하더라도 내부 로직을 계속 실행하고자 한다면 가스 한도(gas stipend)를 명시적으로 지정해야 합니다. 예를 들어, `<Address>.call{gas: <gasAmount>}(data)
` 식으로 말이죠.

일반적으로는 [checks-effects-interactions](http://solidity.readthedocs.io/en/latest/security-considerations.html#use-the-checks-effects-interactions-pattern) 패턴을 따르는 것이 좋습니다. 하지만 함수의 말미에 여러 외부 호출이 있는 경우와 같이, 이러한 DoS 문제가 발생할 수 있는 예외적인 상황도 존재합니다. 

참고: EVM에서 외부 `CALL`은 `CALL` 시점에서 현재 사용 가능한 가스의 최대 63/64까지만 사용할 수 있습니다. 따라서 남은 연산을 처리할 수 있을 정도로의 가스를 1/64만큼 확보한 상태에서 호출하면, 이와 같은 공격을 방어할 수도 있습니다.