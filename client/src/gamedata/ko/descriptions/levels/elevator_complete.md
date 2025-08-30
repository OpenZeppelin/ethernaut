인터페이스에 `view` 함수 제어자(modifier)를 사용하여 상태 수정을 방지할 수 있습니다. `pure` 제어자 또한 함수가 상태를 변경하는 것을 막습니다.
자세한 내용과 주의점을 알아보려면 [Solidity 공식 문서](http://solidity.readthedocs.io/en/develop/contracts.html#view-functions)를 읽어보세요.

이 레벨을 해결하는 또 다른 방법은 `gasleft()`를 사용하는 것처럼, 입력 데이터에 따라 다른 결과를 반환하면서도 상태는 변경하지 않는 view 함수를 구현하는 것입니다.
