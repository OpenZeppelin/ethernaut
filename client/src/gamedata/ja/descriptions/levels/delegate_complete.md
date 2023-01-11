`delegatecall`の使用は特にリスクが高く、歴史的なハッキングでは攻撃方法として使用されてきました。これを使うと、あなたのコントラクトは実質的に「ほら、他のコントラクト、他のライブラリーで私の State であなたの好きなことをしてください」と言っていることになります。委譲者はコントラクトの状態に完全にアクセスできます。`delegatecall`関数は強力な機能ですが、危険な機能でもあるので、細心の注意を払って使用する必要があります。

このアイデアを使って 30M USD を盗まれた事件については、[The Parity Wallet Hack Explained](https://blog.openzeppelin.com/on-the-parity-wallet-multisig-hack-405a8c12e8f7)の記事を参照してください。
