A visszatérési támadások (re-entrancy) megelőzése érdekében, amikor pénzeszközöket mozgatsz ki a szerződésedből, használd a [Checks-Effects-Interactions mintát](https://solidity.readthedocs.io/en/develop/security-considerations.html#use-the-checks-effects-interactions-pattern), figyelembe véve, hogy a `call` csak false-t ad vissza anélkül, hogy megszakítaná a végrehajtási folyamatot. Olyan megoldások is használhatók, mint a [ReentrancyGuard](https://docs.openzeppelin.com/contracts/2.x/api/utils#ReentrancyGuard) vagy a [PullPayment](https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment).

A `transfer` és a `send` már nem ajánlott megoldások, mivel potenciálisan elronthatják a szerződéseket az Istanbul hard fork után [Forrás 1](https://diligence.consensys.net/blog/2019/09/stop-using-soliditys-transfer-now/) [Forrás 2](https://forum.openzeppelin.com/t/reentrancy-after-istanbul/1742).

Mindig feltételezd, hogy a pénzeszközök fogadója, amelyet küldesz, lehet egy másik szerződés, nem csak egy normál cím. Ezért kódot futtathat a payable fallback metódusában és *újra beléphet* a szerződésedbe, esetleg összezavarva az állapotodat/logikádat.

A visszatérés (re-entrancy) gyakori támadás. Mindig készülj fel rá!

&nbsp;
#### A DAO Hack

A híres DAO hack visszatérést használt, hogy hatalmas mennyiségű ethert vonjon ki az áldozat szerződésből. Lásd [15 sor kód, amely megakadályozhatta volna a DAO Hack-et](https://blog.openzeppelin.com/15-lines-of-code-that-could-have-prevented-thedao-hack-782499e00942).
