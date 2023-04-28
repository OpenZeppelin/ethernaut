Vous pouvez utiliser le modificateur de fonction `view` sur une interface afin d'empêcher les modifications d'état. Le modificateur `pure` empêche également les fonctions de modifier l'état.
Assurez-vous de lire [la documentation de Solidity] (http://solidity.readthedocs.io/en/develop/contracts.html#view-functions) et d'apprendre ses mises en garde.

Une autre façon de résoudre ce niveau consiste à créer une fonction de vue qui renvoie des résultats différents en fonction des données d'entrée mais ne modifie pas l'état, par ex. `gasleft()`.
