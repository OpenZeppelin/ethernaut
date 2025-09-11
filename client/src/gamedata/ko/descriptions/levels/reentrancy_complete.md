재진입 공격(Re-Entrancy Attack)을 방지하려면 다음 사항을 유의하세요. 자금 출금 시에는 [Checks-Effects-Interactions](https://solidity.readthedocs.io/en/develop/security-considerations.html#use-the-checks-effects-interactions-pattern) 패턴을 사용하는 것이 좋습니다. 또한 `call` 함수는 실패하더라도 false를 반환할 뿐, 실행 흐름을 중단시키지 않는다는 점을 반드시 인지해야 합니다. [ReentrancyGuard](https://docs.openzeppelin.com/contracts/2.x/api/utils#ReentrancyGuard)나 [PullPayment](https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment) 같은 솔루션도 유용하게 사용할 수 있습니다. 

`transfer`와 `send` 함수는 Istanbul 하드포크 이후 일부 컨트랙트를 오작동시킬 수 있기 때문에, 이제는 더 이상 안전한 방법으로 간주되지 않습니다. ([Source 1](https://diligence.consensys.net/blog/2019/09/stop-using-soliditys-transfer-now/), [Source 2](https://forum.openzeppelin.com/t/reentrancy-after-istanbul/1742) 참고)

자금을 전송할 때의 수신자는 일반 주소가 아닌 컨트랙트일 수 있습니다. 이 경우, 수신 컨트랙트의 payable fallback 함수가 실행되면서 귀하의 컨트랙트에 재진입하여 상태(state)나 로직을 무너뜨릴 수 있습니다. 재진입은 흔한 공격입니다. 항상 이에 대비해야 합니다!

&nbsp;
#### The DAO Hack

유명한 DAO 해킹은 바로 이 재진입 취약점을 이용해 피해 컨트랙트에서 엄청난 양의 이더를 탈취했습니다. [TheDAO 해킹을 막았을 수 도 있는 단 15줄의 코드](https://blog.openzeppelin.com/15-lines-of-code-that-could-have-prevented-thedao-hack-782499e00942)를 참고하세요.