状態の修正を防ぐために、インターフェイス上で `view` 関数修飾子を使用することができます。また、`pure`修飾子も、関数が状態を変更するのを防ぎます。
[Solidity のドキュメント](http://solidity.readthedocs.io/en/develop/contracts.html#view-functions)を読んで、その注意点を学んでください。

このレベルを解決する別の方法は、入力データに依存して異なる結果を返しますが、例えば `gasleft()` のように状態を変更しない表示関数を実装することです。
