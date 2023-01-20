Les overflows sont très communs dans solidity et doivent être vérifiés avec des instructions de contrôle telles que:
```
if(a + c > a) {
  a = a + c;
}
```

Une alternative plus simple consiste à utiliser la bibliothèque SafeMath d'OpenZeppelin qui vérifie automatiquement les overflows dans tous les opérateurs mathématiques. Le code résultant ressemble à ceci:
```
a = a.add(c);
``` 
S'il y a un overflow, le code faira un revert. 