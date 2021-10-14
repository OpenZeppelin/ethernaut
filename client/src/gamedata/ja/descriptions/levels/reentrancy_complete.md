コントラクトから資金を移動させる際にリエントランシー攻撃を防ぐためには、[Checks-Effects-Interactions パターン](https://solidity.readthedocs.io/en/develop/security-considerations.html#use-the-checks-effects-interactions-pattern)を使用し、`call`が実行フローを中断せずに false を返すことを注意してください。[ReentrancyGuard](https://docs.openzeppelin.com/contracts/2.x/api/utils#ReentrancyGuard)や[PullPayment](https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment)などのソリューションも使用できます。

`transfer`と`send`は、イスタンブールのハードフォーク以降、コントラクトを破壊する可能性があるため、推奨されるソリューションではなくなりました[ソース 1](https://diligence.consensys.net/blog/2019/09/stop-using-soliditys-transfer-now/) [ソース 2](https://forum.openzeppelin.com/t/reentrancy-after-istanbul/1742)。

送っている資金の受取人は、通常のアドレスではなく、別のコントラクトである可能性があることを常に想定してください。そのため、支払い可能なフォールバック・メソッドでコードを実行し、あなたのコントラクトに*re-enter*して、あなたの状態/ロジックを混乱させる可能性があります。

リエントラントはよくある攻撃です。常に備えておく必要があります。

&nbsp;

#### The DAO Hack

有名な DAO ハックは、リエントランシーを利用して、被害者のコントラクトから膨大な量の ether を引き出しました。[15 lines of code that could have prevented TheDAO Hack](https://blog.openzeppelin.com/15-lines-of-code-that-could-have-prevented-thedao-hack-782499e00942)をご覧ください。
