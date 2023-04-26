Afin d'éviter les attaques de réentrée lors du retrait de fonds de votre contrat, utilisez le [motif Checks-Effects-Interactions](https://solidity.readthedocs.io/en/develop/security-considerations.html#use-the-checks-effects-interactions-pattern) en soyant conscient que `call` ne renverra que 'false' sans interrompre le flux d'exécution. Des solutions comme [ReentrancyGuard](https://docs.openzeppelin.com/contracts/2.x/api/utils#ReentrancyGuard) ou [PullPayment](https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment) peuvent aussi être utilisées.

`transfer` et `send` ne sont plus des solutions recommandées car elles peuvent potentiellement rompre les contrats après la Istanbul hard fork [Source 1](https://diligence.consensys.net/blog/2019/09/stop-using-soliditys-transfer-now/) [Source 2](https://forum.openzeppelin.com/t/reentrancy-after-istanbul/1742).

Supposez toujours que le destinataire des fonds que vous envoyez peut être un autre contrat, pas seulement une adresse régulière. Par conséquent, il peut exécuter du code dans sa méthode de payable fallback et *re-entrer* votre contrat, et cela risquerait de gâcher votre état/logique.

La réentrance est une attaque courante. Vous devriez toujours être prêt pour cela!

&nbsp;
#### Le DAO Hack

Le célèbre DAO hack a utilisé la réentrance pour extraire une énorme quantité d'éther du contrat de la victime. Voyez [15 lignes de code qui auraient prévenu le DAO Hack](https://blog.openzeppelin.com/15-lines-of-code-that-could-have-prevented-thedao-hack-782499e00942).
