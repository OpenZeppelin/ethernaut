Gördüğümüz gibi, kontratlar arasındaki etkileşim beklenmedik davranışların kaynağı olabilir.

Bir kontratın [ERC20 standardını](https://eips.ethereum.org/EIPS/eip-20) uyguladığını iddia etmesi onun güvenilir olduğu anlamına gelmez.

Bazı tokenler, `transfer` metodlarından boolean değer döndürmeyerek ERC20 standardından sapar. Detaylar için: [Missing return value bug - At least 130 tokens affected](https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected-d67bf08521ca).

Diğer ERC20 tokenleri, özellikle kötü niyetli kişiler tarafından tasarlanmış olanlar, daha zararlı davranabilir.

Eğer bir DEX tasarlıyorsan ve herhangi biri kendi tokenlerini merkezi bir otoritenin izni olmadan listeleyebiliyorsa, DEX’in doğruluğu DEX kontratı ile işlem gören token kontratlarının etkileşimine bağlı olacaktır.