馬鹿げていると思いませんか？現実のコントラクトはこれよりはるかに安全で、ハッキングははるかに困難なはずだ。

しかし...そうではありません。

Rubixi の話は、Ethereum のエコシステムでは非常に有名なケースです。この会社は、社名を「Dynamic Pyramid」から「Rubixi」に変更しましたが、なぜかコントラクトのコンストラクタ・メソッドの名前を変更しませんでした。

```
contract Rubixi {
  address private owner;
  function DynamicPyramid() { owner = msg.sender; }
  function collectAllFees() { owner.transfer(this.balance) }
  ...
```

これにより、攻撃者は古いコンストラクタを呼び出し、契約の所有権を主張して、資金を盗むことができました。そうですね。スマートコントラクトの世界で大きな間違いを犯すことがあります。
