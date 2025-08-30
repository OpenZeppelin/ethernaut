이 레벨은 EVM이 배열의 ABI 인코딩된 길이와 실제 페이로드(payload)를 검증하지 않는다는 점을 악용합니다.

또한, 배열 길이에 산술 언더플로우(arithmetic underflow)를 발생시켜 배열의 범위를 `2^256` 크기의 전체 스토리지 공간으로 확장합니다. 이를 통해 사용자는 컨트랙트의 모든 스토리지를 수정할 수 있게 됩니다.

이 두 가지 취약점은 모두 2017년의 [Underhanded coding contest](https://medium.com/@weka/announcing-the-winners-of-the-first-underhanded-solidity-coding-contest-282563a87079)에서 영감을 얻었습니다.
