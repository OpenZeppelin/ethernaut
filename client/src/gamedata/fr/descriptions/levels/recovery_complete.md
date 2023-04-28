Les adresses de contrat sont déterministes et sont calculées par `keccak256(address, nonce)` où `address` est l'adresse du contrat (ou l'adresse Ethereum qui a créé la transaction) et `nonce` est le nombre de contrats que le contrat de génération a créés (ou le nonce de transaction, pour les transactions régulières).  

Pour cette raison, on peut envoyer de l'éther à une adresse prédéterminée (qui n'a pas de clé privée) et créer plus tard un contrat à cette adresse qui récupère l'éther. Il s'agit d'un moyen non intuitif et quelque peu secret de stocker (dangereusement) de l'éther sans détenir de clé privée.

Un [blog post](https://swende.se/blog/Ethereum_quirks_and_vulns.html) intéressant par Martin Swende explique ce cas en détail. 

Si vous envisagez de mettre en œuvre cette technique, assurez-vous de ne pas manquer le nonce, sinon vos fonds seront perdus à jamais.

