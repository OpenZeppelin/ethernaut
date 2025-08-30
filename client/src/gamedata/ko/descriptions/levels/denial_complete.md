이 레벨은 고정된 가스(gas) 양이 지정되지 않은 경우, 알 수 없는 컨트랙트에 대한 외부 호출이 서비스 거부(Denial of Service) 공격 벡터를 생성할 수 있음을 보여줍니다.

만약 외부 호출이 리버트(revert)될 경우에도 실행을 계속하기 위해 로우 레벨(low-level) `call`을 사용한다면, 고정된 가스 상한(stipend)을 지정해야 합니다. 예를 들어 `call.gas(100000).value()`와 같이 사용합니다.

일반적으로 재진입(re-entrancy) 공격을 피하기 위해 [checks-effects-interactions](http://solidity.readthedocs.io/en/latest/security-considerations.html#use-the-checks-effects-interactions-pattern) 패턴을 따라야 하지만, 함수 마지막에 여러 외부 호출이 있는 경우와 같이 다른 상황에서도 이와 같은 문제가 발생할 수 있습니다.

_참고_: 외부 `CALL`은 호출 시점에서 사용 가능한 가스의 최대 63/64까지 사용할 수 있습니다. 따라서 트랜잭션을 완료하는 데 필요한 가스의 양에 따라, 충분히 높은 가스로 트랜잭션을 보낸다면(예를 들어, 남은 1/64의 가스만으로도 부모 호출의 나머지 op-code 들을 완료할 수 있을 정도) 이 특정 공격을 완화할 수 있습니다.
