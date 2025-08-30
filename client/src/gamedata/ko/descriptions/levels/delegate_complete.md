`delegatecall`의 사용은 특히 위험하며, 과거 여러 해킹 사건에서 공격 벡터로 사용되어 왔습니다. 이를 사용하면, 당신의 컨트랙트는 사실상 "자, 다른 컨트랙트 혹은 라이브러리야, 내 state 를 가지고 네가 원하는 건 뭐든지 해"라고 말하는 것과 같습니다. Delegate 는 컨트랙트의 state 에 대한 완전한 접근 권한을 갖습니다. `delegatecall` 함수는 강력하지만 위험한 기능이므로, 세심한 주의를 기울여 사용해야 합니다.

이 아이디어를 이용해 3천만 달러를 탈취한 사건에 대한 자세한 설명은 [The Parity Wallet Hack Explained](https://blog.openzeppelin.com/on-the-parity-wallet-multisig-hack-405a8c12e8f7) 기사를 참조하세요.
