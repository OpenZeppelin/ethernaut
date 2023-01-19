Dans Solidity, pour qu'un contrat puisse recevoir de l'éther, la fonction de fallback doit être marquée "payable".

Cependant, il n'y a aucun moyen d'empêcher un attaquant d'envoyer de l'éther à un contrat en s'autodétruisant. Par conséquent, il est important de ne pas compter sur l'invariant `address(this).balance == 0` pour toute logique de contrat.