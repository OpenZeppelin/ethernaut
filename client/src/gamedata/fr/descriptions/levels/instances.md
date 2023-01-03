Ce niveau vous permet d'apprendre les bases du jeu.

&nbsp;
#### 1. Configurer MetaMask
Si vous ne l'avez pas déjà, installez [l'extension Metamask](https://metamask.io/) (sur Chrome, Firefox, Brave, ou Opera sur votre ordinateur).
Configurez un portefeuille dans l'extension et utilisez le sélecteur de réseau pour pointer vers "le réseau de test Rinkeby" en haut à gauche de l'interface. 

&nbsp;
#### 2. Ouvrir la console du navigateur
Ouvrez la console de votre navigateur: `Tools > Developer Tools`.

Vous devriez voir quelques messages venant du jeu. L'un d'eux doit indiquer votre adresse de joueur. Elle sera important pendant le jeu ! Vous pouvez toujours voir votre adresse en entrant la commande suivante :
```
player
```

Gardez un œil sur les avertissements et les erreurs, car ils peuvent fournir des informations importantes pendant la partie.

&nbsp;
#### 3. Utiliser les aides de la console

Vous pouvez aussi voir votre solde d'éther actuel en tapant:
```
getBalance(player)
```
###### NOTE: Étendez la promesse pour voir la valeur réelle, même si elle indique 'pending'. Si vous utilisez Chrome v62, vous pouvez utiliser `await getBalance(player)` pour une expérience plus propre de la console. 

Super! Pour voir quelles autres fonctions utilitaires vous avez dans la console, tapez :
```
help()
```
Cela vous sera super pratique pendant le jeu.

&nbsp;
#### 4. Le contrat ethernaut
Entrez la commande suivante dans la console:
```
ethernaut
```

Il s'agit du contrat intelligent principal du jeu. Vous n'avez pas besoin d'interagir avec lui directement via la console ( car cette application le fera pour vous) mais vous pouvez le faire si vous le souhaitez. Jouer avec cet objet est un excellent moyen d'apprendre à interagir avec les autres contrats intelligents du jeu.
Allez-y étendez l'objet éthernaut pour voir ce qu'il y a dedans.

&nbsp;
#### 5. Interagir avec l'ABI
`ethernaut` est un objet `TruffleContract` qui englobe le contrat `Ethernaut.sol` qui a été déployé dans la blockchain.

Entre autres, l'ABI du contrat expose toutes les méthodes publiques de `Ethernaut.sol`, telles que `owner`. Tapez par exemple la commande suivante :
```
ethernaut.owner()
```
###### `await ethernaut.owner()` si vous utilisez Chrome v62.
Vous pouvez voir qui est le propriétaire du contrat ethernaut, qui n'est pas vous bien sûr =D.

&nbsp;
#### 6. Obtenir des éthers de test
Pour jouer au jeu, vous allez avoir besoin d'éthers de test. La manière la plus simple pour en obtenir est via [ce robinet](https://faucet.rinkeby.io/), [celui-ci](https://faucets.chain.link/rinkeby) ou bien [celui-la](https://faucet.paradigm.xyz/).

Une fois que vous voyez des éthers sur votre sole, passons à l'étape suivante.

&nbsp;
#### 7. Créer une instance de niveau
Quand vous jouez sur un niveau, vous n'interagissez pas directement avec le contrat ethernaut. Vous lui demandez plutôt de générer une **instance de niveau** pour vous. Pour ce faire, cliquez sur le bouton bleu en bas de la page. Allez le faire maintenat et revenez. !

Metamask devrez vous demander d'autoriser la transaction. Faites-le, et vous devriez voir quelques messages dans la console. Notez que cela déploie un nouveau contrat dans la blockchain et que cela peut prendre quelques secondes, donc soyez patient lorsque vous demandez de nouvelles instances de niveau.

&nbsp;
#### 8. Inspecter le contract
De la même manière que vous l'avez fait pour le contrat ethernaut, vous pouvez inspecter l'ABI de ce contrat grâce à la console en utilisant la variable `contract`.

&nbsp;
#### 9. Interagir avec le contrat pour finir le niveau
Regardez la méthode d'information du niveau
```
contract.info()
```
###### `await contract.info()` si vous utilisez Chrome v62.
Le contrat devrait contenir tout ce dont vous avez besoin pour terminer le niveau.
Lorsque vous savez que vous avez terminé le niveau, soumettez le contrat en utilisant le bouton orange en bas de la page.
Cela renvoie votre instance à l'éthernaut, qui déterminera si vous avez terminé le niveau.


##### Conseil: n'oubliez pas que vous pouvez toujours consulter l'ABI du contrat
