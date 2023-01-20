De nos jours, payer pour les opérations DeFi est pratiquement impossible!

Un groupe d'amis a découvert comment réduire légèrement le coût d'exécution de plusieurs transactions en les regroupant en une seule transaction. Ils ont donc développé un smart contract pour ce faire.

Ils avaient besoin que ce contrat soit évolutif au cas où le code contiendrait un bug, et ils voulaient également empêcher les personnes extérieures au groupe de l'utiliser. Pour ce faire, ils ont voté et assigné deux personnes avec des rôles spéciaux dans le système :
L'admin, qui a le pouvoir de mettre à jour la logique du contrat.
Le propriétaire (owner), qui contrôle la liste blanche (whitelist) des adresses autorisées à utiliser le contrat.
Les contrats ont été déployés, et le groupe a été whitelisté. Tout le monde a applaudi pour leurs réalisations contre les mineurs gourmands.

Ils ne savaient pas que leur argent était en danger…

&nbsp;
Vous devrez détourner cette wallet pour devenir l'administrateur (admin) du proxy.

&nbsp;
Voici quelques conseils:
* Comprendre le fonctionnement de `delegatecall` et comment `msg.sender` et `msg.value` se comportent lorsqu'ils en effectuent un.
* Connaître les modèles de proxy et la façon dont ils gèrent les variables de stockage (storage variables).