&nbsp;
#### Mécanisme de jeu
Le jeu utilise le contrat principal `Ethernaut.sol` pour gérer la progression du joueur et déléguer l'interaction avec les implémentations de `Level.sol`. Chaque contrat de niveau émet des instances que les joueurs peuvent manipuler, casser, détruire, réparer, etc. Le joueur crée une instance, la manipule et la renvoie au jeu pour l'évaluation de l'achèvement du niveau. La création d'instances et le renvoi d'instances au jeu se font à l'aide des boutons de l'interface utilisateur de chaque niveau. Lorsque l'application récupère une instance de `Ethernaut.sol`, elle l'emballe dans un objet `TruffleContract` et l'expose dans la console du navigateur. Voir le premier niveau pour un tutoriel complet sur la façon de jouer au jeu.

&nbsp;
#### Utilisation de la console du navigateur
La plupart des interactions avec le jeu se font via la console du navigateur : `Dev Tools -> Console`. Ouvrez la console et entrez la commande :
```
help()
```
pour voir la liste d'objets et de fonctions injectés par le jeu dans la console.
Comme la plupart des interactions sont asynchrones, nous recommandons d'utiliser Chrome v62 qui active les mots-clés `async`/`await` dans la console, donc au lieu d'écrire :
```
getBalance(player)
> PROMISE
```
et ouvrir une promesse.

Avec await/async, vous pouvez écrire:
```
await getBalance(player)
> "1.11002387"
```

&nbsp;
#### Au-delà de la console
Certains niveaux nécessiteront de travailler en dehors de la console du navigateur. C'est-à-dire écrire du code Solidity et le déployer sur le réseau pour attaquer le contrat d'instance du niveau avec un autre contrat. Cela peut être fait de plusieurs façons, par exemple :
1) Utiliser Remix pour écrire le code et le déployer sur le réseau correspondant Voir [Remix Solidity IDE](https://remix.ethereum.org/).
2) Configurer un projet truffle local pour développer et déployer les contrats d'attaque. Voir [Truffle Framework](http://truffleframework.com/).


&nbsp;
#### Problèmes
Parfois (a) l'état de l'application ou (b) l'état de l'extension MetaMask peuvent être un peu perturbés, surtout après un changement de réseau, un déverrouillage, etc. Si ce que vous voyez n'a pas de sens, essayez de rafraîchir l'application, de recharger complètement la page, de désactiver et réactiver votre extension MetaMask ou même de redémarrer votre navigateur.
Si vous rencontrez des problèmes, veuillez nous en faire part à l'adresse ethernaut@zeppelin.solutions.