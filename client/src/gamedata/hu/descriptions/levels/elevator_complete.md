Használhatod a `view` függvény módosítót egy interfészen, hogy megakadályozd az állapot módosításokat. A `pure` módosító szintén megakadályozza a függvényeket az állapot módosításában.
Győződj meg róla, hogy elolvasod a [Solidity dokumentációját](http://solidity.readthedocs.io/en/develop/contracts.html#view-functions) és megtanulod a buktatóit.

Egy alternatív módja ennek a szintnek a megoldására egy olyan view függvény építése, amely különböző eredményeket ad vissza a bemeneti adatoktól függően, de nem módosítja az állapotot, pl. `gasleft()`.
