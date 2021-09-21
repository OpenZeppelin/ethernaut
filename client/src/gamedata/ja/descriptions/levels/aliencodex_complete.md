このレベルでは、EVM が配列の ABI エンコードされた長さと実際のペイロードを検証していないことを悪用しています。

さらに、配列の長さを算術的にアンダーフローすることを利用して、`2^256`の記憶領域全体の配列の境界を拡大しています。これにより、ユーザーはすべてのコントラクトストレージを変更することができます。

両方の脆弱性は、2017 年[Underhanded coding contest](https://medium.com/@weka/announcing-the-winners-of-the-first-underhanded-solidity-coding-contest-282563a87079)からヒントを得ています。
