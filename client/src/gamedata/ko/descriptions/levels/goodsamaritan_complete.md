축하합니다!

Solidity의 커스텀 에러(Custom errors)는 함수 호출과 마찬가지로 4바이트 '셀렉터(selector)'로 식별됩니다. 이 에러들은 `GoodSamaritan`의 `requestDonation()` 함수에서 볼 수 있듯이, `try-catch` 블록의 `catch` 구문에 의해 잡힐 때까지 호출 체인(call chain)을 따라 위로 전파됩니다. 이러한 이유로, 에러가 컨트랙트 호출의 직접적인 대상(이 경우 `Wallet`)에 의해 발생했다고 가정하는 것은 안전하지 않습니다. 호출 체인의 더 아래쪽에 있는 다른 어떤 컨트랙트라도 동일한 에러를 선언하고, 공격자 컨트랙트의 `notify(uint256 amount)` 함수와 같이 예상치 못한 위치에서 에러를 발생시킬 수 있습니다.
