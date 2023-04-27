A vantagem de seguir um padrão UUPS é ter um proxy mínimo para ser publicado. O proxy atua como camada de armazenamento, portanto, qualquer alteração de estado no contrato de implementação normalmente não produz efeitos colaterais nos sistemas que o utilizam, pois apenas a lógica é usada por meio de `deleagte calls`.

Isso não significa que você não deva ficar atento a vulnerabilidades que podem ser exploradas se deixarmos um contrato de implementação não inicializado.

Esta foi uma versão um pouco simplificada do que realmente foi descoberto após meses do lançamento do padrão UUPS.

Dicas: nunca deixe contratos de implementação não inicializados ;)

Se você estiver interessado no que aconteceu, leia mais [aqui](https://forum.openzeppelin.com/t/uupsupgradeable-vulnerability-post-mortem/15680).