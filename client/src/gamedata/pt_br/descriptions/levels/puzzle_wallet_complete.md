Da próxima vez, esses amigos solicitarão uma auditoria antes de depositar qualquer dinheiro em um contrato. Parabéns!

Freqüentemente, o uso de contratos de proxy é altamente recomendado para trazer recursos de atualização e reduzir o custo de gás da publicação. No entanto, os desenvolvedores devem ter cuidado para não introduzir colisões de armazenamento, como visto neste nível.

Além disso, a iteração de operações que consomem ETH pode levar a problemas se não forem tratadas corretamente. Mesmo que o ETH seja gasto, `msg.value` permanecerá o mesmo, portanto, o desenvolvedor deve acompanhar manualmente o valor restante real em cada iteração. Isso também pode levar a problemas ao usar um padrão de várias chamadas, pois executar várias `delegatecall`s para uma função que parece segura por si só pode levar a transferências indesejadas de ETH, pois `delegatecall`s mantêm o `msg.value` original enviado para o contrato.

Passe para o próximo nível quando estiver pronto!