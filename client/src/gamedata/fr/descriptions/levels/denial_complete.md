Ce niveau démontre que les appels externes à des contrats inconnus peuvent encore créer des vecteurs d'attaque par déni de service si une quantité fixe de gaz n'est pas spécifié.

Si vous utilisez un `call` de bas niveau pour continuer l'exécution en cas de retour d'un appel externe, assurez-vous de spécifier une allocation de gaz fixe. Par exemple `call.gas(100000).value()`.

En règle générale, il faut suivre le modèle [checks-effects-interactions](http://solidity.readthedocs.io/en/latest/security-considerations.html#use-the-checks-effects-interactions-pattern) pour éviter les attaques de reentrancy, il peut y avoir d'autres circonstances (telles que plusieurs appels externes à la fin d'une fonction) où des problèmes tels que celui-ci peuvent survenir.

*Remarque* : Un `CALL` externe peut utiliser au maximum 63/64 du gaz actuellement disponible au moment du `CALL`. 
Ainsi, selon la quantité de gaz nécessaire pour conclure une transaction, une transaction de gaz suffisamment élevé 
(c'est-à-dire un tel que 1/64 du gaz est capable de compléter les opcodes restants dans l'appel parent) peut être utilisé pour atténuer cette attaque particulière.
