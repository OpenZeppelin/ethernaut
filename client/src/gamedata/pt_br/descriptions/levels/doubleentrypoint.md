Este nível apresenta um `CryptoVault` com uma funcionalidade especial, a função `sweepToken`. Esta é uma função comum usada para recuperar tokens presos em um contrato. O `CryptoVault` opera com um token subjacente que não pode ser varrido, pois é um importante componente lógico central do `CryptoVault`. Quaisquer outros tokens podem ser varridos.

O token subjacente é uma instância do token DET implementado no contrato `DoubleEntryPoint` e o `CryptoVault` contém 100 unidades dele. Além disso, o `CryptoVault` também contém 100 de `LegacyToken LGT`.

Neste nível, você deve descobrir onde o bug está no `CryptoVault` e protegê-lo de ter seus tokens drenados.

O contrato apresenta um contrato `Forta` onde qualquer usuário pode registrar seu próprio contrato de `bot de detecção`. O `Forta` é uma rede de monitoramento descentralizada e baseada na comunidade para detectar ameaças e anomalias em DeFi, NFT, governança, pontes e outros sistemas Web3 o mais rápido possível. Seu trabalho é implementar um `bot de detecção` e registrá-lo no contrato `Forta`. A implementação do bot precisará gerar alertas corretos para evitar possíveis ataques ou bugs.

Coisas que podem ser úteis:
* Como funciona um ponto de entrada dupla para um contrato de token?