축하합니다! 

이제 당신은 [Forta Bot](https://docs.forta.network/en/latest/)을 처음으로 체험했습니다. 

Forta는 독립적인 노드 운영자들의 탈중앙 네트워크로 구성되며, 모든 트랜잭션과 블록 단위의 상태 변화를 실시간으로 스캔하여 이상 징후나 위협이 발견되면 구독자에게 경고(alert)를 전송합니다. 이를 통해 사용자들은 신속히 대응할 수 있게 됩니다. 

이 레벨에서 제시된 예제는 교육용 예시일 뿐이며, Forta 봇은 스마트 컨트랙트로 모델링되지 않았습니다. Forta의 봇은 특정 조건이나 이벤트를 감지하는 코드 스크립트 형태이지만, 경보가 발령되면 적어도 아직은 자동 조치를 트리거하지 않습니다. 이 수준에서 봇의 경고는 의도된 Forta의 봇 설계에서 벗어나 트랜잭션을 효과적으로 되돌리도록 트리거합니다.

탐지 봇은 컨트랙트의 최종 구현에 매우 의존적이기 때문에, 컨트랙트가 업그레이드되면 봇과의 연동이 끊어질 수 있습니다. 이런 상황을 대비해 업그레이드를 감지하고 반응하는 전용 봇을 만들 수도 있습니다. 방법은 [여기에서 확인하세요.](https://docs.forta.network/en/latest/quickstart/)

또한 이 레벨은 최근 [OpenZeppelin과 Compound 트로토콜의 협업 과정](https://compound.finance/governance/proposals/76) 중 밝혀진 실제 보안 이슈를 기반으로 하고 있습니다. 

이중 진입점(Double Entry Point) 패턴을 사용하는 토큰은 하나의 토큰에 하나의 컨트랙트만 존재한다는 일반적인 전제를 깨트립니다. 이로 인해 여러 프로토콜에서 예기치 않은 문제가 발생할 수 있습니다. 자세한 내용은 다음 회고록에서 확인해보세요: [Compound TUSD 통합 관련 사고 분석 블로그](https://blog.openzeppelin.com/compound-tusd-integration-issue-retrospective/)