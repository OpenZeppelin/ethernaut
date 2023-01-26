L'utilisation de `delegatecall` est particulièrement risquée et a été utilisée comme vecteur d'attaque sur plusieurs hacks historiques. Avec cette fonction, votre contrat dit pratiquement "ici, -autre contrat- ou -autre library-, faites ce que vous voulez de mon état". Les délégués (delegates) ont un accès complet à l'état de votre contrat. La fonction `delegatecall` est une fonctionnalité puissante, mais dangereuse, et doit être utilisée avec une extrême prudence.


Veuillez vous référer à l'article [The Parity Wallet Hack Explained](https://blog.openzeppelin.com/on-the-parity-wallet-multisig-hack-405a8c12e8f7) pour une explication précise de la façon dont cette idée a été utilisée pour voler 30M USD.
