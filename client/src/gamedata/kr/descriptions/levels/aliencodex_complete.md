이 레벨은 EVM이 배열의 ABI-인코딩된 길이와 실제 페이로드를 검증하지 않는 사실을 악용해요.

또한 배열 길이의 산술적 언더플로우를 이용해서 배열의 경계를 `2^256` 전체 스토리지 영역으로 확장해요. 그렇게 하면 사용자가 모든 컨트랙트 저장소를 수정할 수 있어요.

이 두 취약점은 2017년의 [undrehanded coding contest]에서 영감을 받았어요.(https://medium.com/@weka/announcing-the-winners-of-the-first-underhanded-solidity-coding-contest-282563a87079)
