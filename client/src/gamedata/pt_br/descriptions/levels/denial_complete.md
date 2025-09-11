Este nível demonstra que as chamadas externas para contratos desconhecidos ainda podem
criar vetores de ataque de negação de serviço (DDoS) se uma quantidade fixa de gás não for
especificadas.

Se você estiver usando uma `call` de baixo nível que continua executando no caso de uma chamada externa ser revertida, certifique-se de especificar um limite de gás as ser utilizado. Por exemplo `<Address>.call{gas: <gasAmount>}(data)
`.

Normalmente, deve-se seguir o padrão [checks-effects-interactions](http://solidity.readthedocs.io/en/latest/security-considerations.html#use-the-checks-effects-interactions-pattern) para evitar ataques de reentrância. Pode haver outras circunstâncias (como várias chamadas externas no final de uma função) em que problemas como esse podem surgir.

*Nota*: Uma `CALL` externa pode usar no máximo 63/64 do gás atualmente disponível
no momento da `CALL`. Assim, dependendo de quanto gás é necessário para
concluir uma transação, uma transação de gás suficientemente alto (ou seja, uma desses
que 1/64 do gás é capaz de completar os opcodes restantes na chamada pai) pode ser usado para atenuar esse ataque específico.