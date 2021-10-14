繰り返し私たちは見てきたように、コントラクト間の相互作用は予期せぬ動作の原因となります。

コントラクトが[ERC20 spec](https://eips.ethereum.org/EIPS/eip-20)を実装していると主張しているからといって、それが信頼に値するとは限りません。

トークンの中には、`transfer`メソッドから真偽値を返さないことで ERC20 仕様から逸脱しているものがあります。[Missing return value bug - At least 130 tokens affected](https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected-d67bf08521ca)を参照してください。

他の ERC20 トークン、特に敵対者によって設計されたものは、より悪意のある動作をする可能性があります。

誰もが中央機関の許可なく自分のトークンをリストアップできる DEX を設計した場合、DEX の正しさは DEX のコントラクトと取引されるトークン・コントラクトの相互作用に依存する可能性があります。
