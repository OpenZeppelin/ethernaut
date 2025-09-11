`delegatecall`의 사용은 특히 위험하며, 과거 여러 해킹 사례에서 공격 벡터로 활용되었습니다. 이 기능을 사용하면 계약이 마치 “여기, —다른 컨트랙트—나 —다른 라이브러리—야, 내 상태를 마음껏 다루어도 돼”라고 말하는 것과 같습니다. Delegate는 컨트랙트의 상태에 완전하게 접근할 수 있습니다. `delegatecall` 함수는 매우 강력하지만 위험하므로 극도의 주의가 필요합니다.

정확한 설명을 위해 이 아이디어가 어떻게 3천만 달러를 탈취하는 데 사용되었는지 다룬 [The Parity Wallet Hack Explained](https://blog.openzeppelin.com/on-the-parity-wallet-multisig-hack-405a8c12e8f7) 글을 참고하세요.
