A Solidity-ben, hogy egy szerződés tudjon ethert fogadni, a fallback függvényt `payable`-ként kell megjelölni.

Azonban nincs módja megakadályozni, hogy egy támadó ethert küldjön egy szerződésnek önmegsemmisítéssel. Ezért fontos, hogy ne számíts az `address(this).balance == 0` invariánsra semmilyen szerződési logikában.

