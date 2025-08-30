이 게이트키퍼(gatekeeper)는 몇 가지 새로운 챌린지를 소개합니다. 이 레벨을 통과하려면 참가자(entrant)로 등록하세요.

이 레벨의 힌트:

- 첫 번째 게이트키퍼를 통과하며 배운 것을 기억하세요. 첫 번째 게이트는 동일합니다.
- 두 번째 게이트의 `assembly` 키워드는 컨트랙트가 일반적인 Solidity의 네이티브 기능이 아닌 기능에 접근할 수 있게 해줍니다. 자세한 내용은 [Solidity Assembly](http://solidity.readthedocs.io/en/v0.4.23/assembly.html) 문서를 참조하세요. 이 게이트의 `extcodesize` 호출은 주어진 주소에 있는 컨트랙트 코드의 크기를 가져옵니다. 이것이 언제 어떻게 설정되는지에 대해서는 [이더리움 황서(yellow paper)](https://ethereum.github.io/yellowpaper/paper.pdf) 7장에서 더 자세히 알아볼 수 있습니다.
- 세 번째 게이트의 `^` 문자는 비트 연산(XOR)이며, 여기서는 다른 일반적인 비트 연산을 적용하는 데 사용됩니다 ([Solidity cheatsheet](https://www.google.com/search?q=http.solidity.readthedocs.io/en/v0.4.23/miscellaneous.html%23cheatsheet) 참조). 'Coin Flip' 레벨을 다시 살펴보는 것도 이 챌린지에 접근하는 좋은 시작점이 될 수 있습니다.
