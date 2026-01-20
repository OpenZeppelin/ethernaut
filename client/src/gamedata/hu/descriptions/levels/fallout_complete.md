Ez elég buta volt, nem? A valós világbeli szerződéseknek sokkal biztonságosabbnak kell lenniük ennél, és sokkal nehezebbnek kell lennie őket feltörni, igaz?

Nos... Nem egészen.

A Rubixi története egy nagyon ismert eset az Ethereum ökoszisztémában. A cég megváltoztatta a nevét 'Dynamic Pyramid'-ről 'Rubixi'-re, de valahogy nem nevezték át a szerződésük konstruktor metódusát:

```
contract Rubixi {
  address private owner;
  function DynamicPyramid() { owner = msg.sender; }
  function collectAllFees() { owner.transfer(this.balance) }
  ...
```

Ez lehetővé tette a támadónak, hogy meghívja a régi konstruktort és megszerezze a szerződés tulajdonjogát, valamint ellopjon néhány pénzeszközt. Igen. Nagy hibák követhetők el az okosszerződések világában.
