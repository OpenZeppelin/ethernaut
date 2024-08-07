このゲートキーパーには、いくつかの新しい課題が導入されています。このレベルをクリアするためには、侵入者として登録してください。

このレベルのヒント：

- 最初のゲートキーパーを通過したときに学んだことを思い出してください。
- 第 2 のゲートの`assembly`キーワードは、コントラクトが vanilla Solidity のネイティブではない機能にアクセスすることを可能にします。詳しくは[Solidity Assembly](http://solidity.readthedocs.io/en/v0.4.23/assembly.html)をご覧ください。このゲートの`extcodesize`コールは、与えられたアドレスにおけるコントラクトのコードのサイズを取得します。これがいつどのように設定されるかについては、[イエローペーパー](https://ethereum.github.io/yellowpaper/paper.pdf)のセクション 7 で詳しく知ることができます。
- 3 番目のゲートの`^`文字はビット演算（XOR）で、ここでは別の一般的なビット演算を適用するために使用されています（[Solidity cheatsheet](http://solidity.readthedocs.io/en/v0.4.23/miscellaneous.html#cheatsheet)を参照）。この課題に取り組む際には、「Coin Flip」レベルから始めるのも良いでしょう。
