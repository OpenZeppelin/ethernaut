L'avantage de suivre un modèle UUPS est d'avoir un proxy très minimal à déployer. Le proxy agit comme une couche de stockage, de sorte que toute modification d'état dans le contrat d'implémentation ne produit normalement pas d'effets secondaires sur les systèmes qui l'utilisent, puisque seule la logique est utilisée via les delegatecalls.

Cela ne signifie pas que vous ne devez pas faire attention aux vulnérabilités qui peuvent être exploitées si nous laissons un contrat d'implémentation non initialisé.

Il s'agissait d'une version légèrement simplifiée de ce qui a vraiment été découvert après des mois de la publication du modèle UUPS.

Takeaways : ne laissez jamais les contrats de mise en œuvre non initialisés ;)

Si vous êtes intéressé par ce qui s'est passé, lisez plus [ici](https://forum.openzeppelin.com/t/uupsupgradeable-vulnerability-post-mortem/15680).