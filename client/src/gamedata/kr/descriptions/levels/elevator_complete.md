인터페이스에 `view` 함수 수식자(modifier)를 붙이면, 상태 변경을 방지할 수 있습니다. `Pure` 수식자는 함수가 상태를 전혀 읽거나 수정하지 않도록 제한합니다. 반드시 [Solidity 공식 문서](http://solidity.readthedocs.io/en/develop/contracts.html#view-functions)를 참고하여 이러한 수식자의 제약사항과 주의점들을 학습하세요. 

이 레벨을 해결하는 또 다른 방법은, 입력값에 따라 서로 다른 결과를 반환하지만 상태는 변경하지 않는 view 함수를 작성하는 것 입니다. 예를 들어, `gasleft()` 함수를 활용할 수 있습니다.