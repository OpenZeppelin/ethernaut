Ce niveau exploite le fait que l'EVM ne valide pas la longueur encodée en ABI d'un array par rapport à sa charge utile réelle.

De plus, il exploite l'underflow arithmétique de la longueur du tableau, en étendant les limites du tableau à la zone de stockage entière de `2 ^ 256`. L'utilisateur est alors en mesure de modifier tous les contrats de stockage.

Ces deux vulnérabilités sont inspirées du [Underhanded coding contest](https://medium.com/@weka/announcing-the-winners-of-the-first-underhanded-solidity-coding-contest-282563a87079) de 2017.
