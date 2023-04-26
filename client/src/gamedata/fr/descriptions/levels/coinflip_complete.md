Générer des nombres aléatoires en solidity peut être délicat. Il n'existe actuellement aucun moyen natif de les générer, et tout ce que vous utilisez dans les contrats intelligents est visible publiquement, y compris les variables locales et les variables d'état marquées comme privées. Les mineurs ont également le contrôle sur des éléments tels que les blocs de hachage, les horodatages et l'inclusion ou non de certaines transactions - ce qui leur permet de biaiser ces valeurs en leur faveur.

Pour obtenir des nombres aléatoires prouvés cryptographiquement, vous pouvez utiliser [Chainlink VRF](https://docs.chain.link/docs/get-a-random-number), qui utilise un oracle, le jeton LINK et un contrat intelligent pour vérifier que le nombre est vraiment aléatoire.

Certaines autres options incluent l'utilisation d'en-têtes de bloc Bitcoin (verifiés via [BTC Relay](http://btcrelay.org), [RANDAO](https://github.com/randao/randao), ou [Oraclize](http://www.oraclize.it/)).
