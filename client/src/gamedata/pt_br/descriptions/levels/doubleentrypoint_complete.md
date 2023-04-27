Parabéns!

Esta é a primeira experiência que você tem com um [bot Forta](https://docs.forta.network/en/latest/).

O Forta compreende uma rede descentralizada de operadores de nós independentes que verificam todas as transações e alterações de estado bloco a bloco em busca de transações e ameaças atípicas. Quando um problema é detectado, os operadores de nó enviam alertas aos assinantes sobre possíveis riscos, o que os permite agir.

O exemplo apresentado é apenas para fins educacionais, pois o bot Forta não é modelado em contratos inteligentes. No Forta, um bot é um script de código para detectar condições ou eventos específicos, mas quando um alerta é emitido, ele não aciona ações automáticas - pelo menos ainda não. Nesse nível, o alerta do bot aciona efetivamente uma reversão na transação, desviando-se do design pretendido do bot do Forta.

Os bots de detecção dependem muito das implementações finais do contrato e alguns podem ser atualizados e interromper as integrações do bot, mas para mitigar isso, você pode até criar um bot específico para procurar atualizações de contrato e reagir a elas. Aprenda como fazer [aqui](https://docs.forta.network/en/latest/quickstart/).

Você também passou por um problema de segurança recente que foi descoberto durante a mais recente [colaboração com o protocolo Compound](https://compound.finance/governance/proposals/76) da OpenZeppelin.

Ter tokens que apresentam um ponto de entrada duplo é um padrão não trivial que pode afetar muitos protocolos. Isso ocorre porque é comumente assumido que há um contrato por token. Mas não foi o caso desta vez :) Você pode ler todos os detalhes do que aconteceu [aqui](https://blog.openzeppelin.com/compound-tusd-integration-issue-retrospective/).