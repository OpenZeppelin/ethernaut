C'était facile n'est-ce pas ? Les contrats du monde réel doivent être beaucoup plus sûrs que cela et il doit donc être beaucoup plus difficile de les pirater, n'est-ce pas ?

Eh bien... Pas tout à fait.

L'histoire de Rubixi est un cas très connu dans l'écosystème Ethereum. L'entreprise a changé son nom de "Dynamic Pyramid" en "Rubixi", mais d'une manière ou d'une autre, ils n'ont pas renommé la méthode constructeur de son contrat :

```
contract Rubixi {
  address private owner;
  function DynamicPyramid() { owner = msg.sender; }
  function collectAllFees() { owner.transfer(this.balance) }
  ...
```

Cela a permis à l'attaquant d'appeler l'ancien constructeur et de revendiquer la propriété du contrat, et de voler des fonds. Ouais. De grosses erreurs peuvent être commises dans la terredessmartcontracts.
