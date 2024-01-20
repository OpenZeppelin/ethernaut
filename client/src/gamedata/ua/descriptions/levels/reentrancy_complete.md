Для того, щоб запобігти атакам реентрантности при виведенні коштів з вашого контракту, використовуйте [паттерн Перевірка-Ефекти-Взаємодії](https://solidity.readthedocs.io/en/develop/security-considerations.html#use-the-checks-effects-interactions-pattern), пам'ятаючи, що `call` лише поверне false, не перериваючи потік виконання. Можна також використовувати рішення, такі як [ReentrancyGuard](https://docs.openzeppelin.com/contracts/2.x/api/utils#ReentrancyGuard) або [PullPayment](https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment).

`transfer` та `send` вже не рекомендуються, оскільки вони можуть потенційно зламати контракти після хардфорку Istanbul [Джерело 1](https://diligence.consensys.net/blog/2019/09/stop-using-soliditys-transfer-now/) [Джерело 2](https://forum.openzeppelin.com/t/reentrancy-after-istanbul/1742).

Завжди враховуйте, що одержувач коштів, які ви відправляєте, може бути іншим контрактом, а не просто звичайною адресою. Отже, він може виконувати код у своєму оплачуваному методі запасу і *повторно увійти* у ваш контракт, можливо, зіпсувавши ваш стан/логіку.

Реентрантність - це поширена атака. Ви повинні завжди бути до неї готові!

&nbsp;
#### Хак DAO

У знаменитій атакі DAO було використано реентрантність для виведення великої суми ефіру з потерпілого контракту. Дивіться [15 рядків коду, які могли б виключити можливість атаки на TheDAO](https://blog.openzeppelin.com/15-lines-of-code-that-could-have-prevented-thedao-hack-782499e00942).
