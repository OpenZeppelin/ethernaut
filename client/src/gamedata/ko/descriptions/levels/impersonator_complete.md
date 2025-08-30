축하합니다! 당신은 타원 곡선 서명(elliptic curve signatures)의 비밀을 성공적으로 풀었습니다!

[EIP-2](https://eips.ethereum.org/EIPS/eip-2)에 설명된 바와 같이, 현재의 경우처럼 검증 로직에서 `0 < s < secp256k1n` 범위의 `s` 값을 허용하면 서명 가변성(signature malleability) 문제가 발생할 수 있습니다. 누구나 임의의 서명을 가져와 `s` 값을 `s`에서 `secp256k1n - s`로 뒤집고, `v` 값을 변경(27 -> 28, 28 -> 27)하더라도, 결과적인 서명은 여전히 동일한 서명자를 복구하게 됩니다.

무엇을 하고 있는지 정확히 알지 못한다면 안전한 구현체를 사용하는 것이 중요합니다. [OpenZeppelin의 구현체](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/448efeea6640bbbc09373f03fbc9c88e280147ba/contracts/utils/cryptography/ECDSA.sol#L128-L154)를 확인하여 `ecrecover`를 안전하게 사용하는 방법을 배워보세요.
