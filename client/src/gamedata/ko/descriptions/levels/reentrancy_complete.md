컨트랙트에서 자금을 외부로 이동시킬 때 재진입(re-entrancy) 공격을 방지하려면, [Checks-Effects-Interactions 패턴](https://solidity.readthedocs.io/en/develop/security-considerations.html#use-the-checks-effects-interactions-pattern)을 사용하고, `call`은 실행 흐름을 중단시키지 않고 실패 시 `false`만 반환한다는 점에 유의해야 합니다. 또한 [ReentrancyGuard](https://docs.openzeppelin.com/contracts/2.x/api/utils#ReentrancyGuard)나 [PullPayment](https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment)와 같은 해결책을 사용할 수도 있습니다.

이스탄불 하드포크 이후 `transfer`와 `send`는 컨트랙트를 망가뜨릴 수 있는 가능성 때문에 더 이상 권장되는 해결책이 아닙니다. [출처 1](https://diligence.consensys.net/blog/2019/09/stop-using-soliditys-transfer-now/) [출처 2](https://forum.openzeppelin.com/t/reentrancy-after-istanbul/1742).

당신이 보내는 자금의 수신자는 일반 주소뿐만 아니라 다른 컨트랙트일 수 있다고 항상 가정해야 합니다. 따라서 수신 컨트랙트는 자신의 `payable fallback` 메서드에서 코드를 실행하여 당신의 컨트랙트로 _재진입(re-enter)_ 하여 상태나 로직을 엉망으로 만들 수 있습니다.

재진입은 흔한 공격입니다. 항상 대비해야 합니다!

&nbsp;

#### The DAO 해킹

유명한 DAO 해킹은 재진입 공격을 사용하여 피해 컨트랙트에서 막대한 양의 이더를 빼돌렸습니다. [TheDAO 해킹을 막을 수 있었던 15줄의 코드](https://blog.openzeppelin.com/15-lines-of-code-that-could-have-prevented-thedao-hack-782499e00942)를 참조하세요.
