UUPS 패턴의 장점은, 매우 간결한 프록시만 배포하면 된다는 점입니다. 프록시는 오직 저장소 계층으로만 작동하며, 상태 변경은 모두 delegatecall을 통해 구현 컨트랙트의 로직을 사용해 이루어지기 때문에 일반적으로 외부 시스템에는 영향을 주지 않습니다. 

하지만 그렇다고 해서 구현 컨트랙트(implementation contract)를 초기화 없이 방치해도 괜찮다는 뜻은 아닙니다.

이번 레벨은 UUPS 패턴이 도입된 후 실제 발견된 취약점을 약간 단순화한 형태로 재현한 예제입니다. 

요점: 구현 컨트랙트를 초기화하지 않은 채로 두지 마세요 ;)

자세한 내용이 궁금하다면 [링크](https://forum.openzeppelin.com/t/uupsupgradeable-vulnerability-post-mortem/15680)를 참조하세요.