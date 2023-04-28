Comme au niveau précédent, `delegate` mentionne l'utilisation de `delegatecall` pour appeler
les bibliothèques peuvent être risquées. Cela est particulièrement vrai pour les bibliothèques contractuelles qui
ont leur propre état. Cet exemple montre pourquoi le mot-clé `library`
doit être utilisé pour construire des bibliothèques, car il empêche les bibliothèques de
stocker et accéder aux variables d'état (state variables).

