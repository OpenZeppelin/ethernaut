Kontratından fon gönderirken re-entrancy (yeniden giriş) saldırılarını önlemek için [Checks-Effects-Interactions pattern](https://solidity.readthedocs.io/en/develop/security-considerations.html#use-the-checks-effects-interactions-pattern) kullanılmalıdır. Bu sırada, `call` yalnızca false döndürür, fakat yürütmeyi durdurmaz. Ayrıca [ReentrancyGuard](https://docs.openzeppelin.com/contracts/2.x/api/utils#ReentrancyGuard) veya [PullPayment](https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment) gibi çözümler de kullanılabilir.

`transfer` ve `send`, İstanbul hard fork’tan sonra kontratları bozabileceğinden ötürü artık önerilen yöntemler değildir [Source 1](https://diligence.consensys.net/blog/2019/09/stop-using-soliditys-transfer-now/) [Source 2](https://forum.openzeppelin.com/t/reentrancy-after-istanbul/1742).

Gönderdiğin fonların alıcısının sadece bir adres değil, başka bir kontrat olabileceğini her zaman göz önünde bulundur. Bu durumda alıcı, kendi payable fallback fonksiyonunda kod çalıştırabilir ve kontratına tekrar giriş yapabilir (re-enter), bu da state/logic’ini bozabilir.

Re-entrancy yaygın bir saldırı yöntemidir. Her zaman hazırlıklı ol!

&nbsp;
#### The DAO Hack

Ünlü DAO hack saldırısı, re-entrancy kullanılarak hedef kontrattan büyük miktarda ether çalınmasını sağlamıştı. [Bu saldırıyı önleyebilecek 15 satırlık kod örneğine göz atabilirsin](https://blog.openzeppelin.com/15-lines-of-code-that-could-have-prevented-thedao-hack-782499e00942).
