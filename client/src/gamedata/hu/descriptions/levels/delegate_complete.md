A `delegatecall` használata különösen kockázatos, és több történelmi hackben támadási vektorként használták. Ezzel a szerződésed gyakorlatilag azt mondja: "itt van, -másik szerződés- vagy -másik könyvtár-, csinálj amit akarsz az állapotommal". A delegáltaknak teljes hozzáférésük van a szerződésed állapotához. A `delegatecall` függvény egy erőteljes funkció, de veszélyes, és rendkívüli óvatossággal kell használni.


Kérlek nézd meg [A Parity Wallet Hack magyarázata](https://blog.openzeppelin.com/on-the-parity-wallet-multisig-hack-405a8c12e8f7) cikket egy pontos magyarázatért, hogyan használták ezt az ötletet 30 millió USD ellopására.

