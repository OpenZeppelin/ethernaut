La prochaine fois, ces amis demanderont un audit avant de déposer de l'argent sur un contrat. Félicitations!

Souvent, l'utilisation de contrats proxy est fortement recommandée pour apporter des fonctionnalités d'évolutivité (upgradability) et réduire le coût du gaz du déploiement. Cependant, les développeurs doivent faire attention à ne pas introduire de collisions de stockage, comme on le voit dans ce niveau.

De plus, l'itération sur des opérations qui consomment de l'ETH peut entraîner des problèmes si elle n'est pas gérée correctement. Même si ETH est dépensé, `msg.value` restera le même, de sorte que le développeur doit suivre manuellement le montant restant réel à chaque itération. Cela peut également entraîner des problèmes lors de l'utilisation d'un modèle de plusieurs appels (multi-call pattern), car l'exécution de plusieurs `delegatecall`s vers une fonction qui semble sûre pourrait entraîner des transferts indésirables d'ETH, car `delegatecall`s conserve le `msg.value` d'origine envoyé au contrat.

Passez au niveau suivant lorsque vous êtes prêt!