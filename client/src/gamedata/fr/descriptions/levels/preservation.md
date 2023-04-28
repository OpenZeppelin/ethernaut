Ce contrat utilise une bibliothèque pour stocker deux heures différentes pour deux
fuseaux horaires. Le constructeur (constructor) crée deux instances de la bibliothèque à chaque fois
pour être stocké.

L'objectif de ce niveau est que vous réclamez la propriété (owner) de l'instance qui vous est donnée.

&nbsp; Voici quelques conseils:
* Consultez la documentation de Solidity sur la fonction de `delegatecall` de low level,
  comment cela fonctionne, comment elle peut être utilisée pour déléguer des opérations vers des bibliothèques en-chaine (onchain libraries) et quelles implications cela a sur la portée d'exécution (execution scope).
* Comprendre ce que veut dire quand `delegatecall` présèrve le contexte (context-preserving `delegatecall`).
* Comprendre comment les variables de stockage sont stockées et accessibles.
* Comprendre le fonctionnement du casting entre différents types de données.
