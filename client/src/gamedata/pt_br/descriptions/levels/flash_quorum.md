Uma pequena DAO tem um pequeno tesouro, protegido por uma única regra: quem chamar `executeProposal` precisa ter pelo menos 50% do supply do token de governança. Você começa sem nenhum desse token, e nem comprá-lo nem recebê-lo de presente é uma opção.

Acontece que o token de governança tem suporte a flash loans, cobrando a mesma taxa de 0.3% que a Uniswap V2 cobra em um flash swap. Você recebeu um pequeno saldo inicial, longe o suficiente de alcançar o quórum apenas segurando-o.

Complete este nível drenando o tesouro.

&nbsp;
Coisas que podem ser úteis
* O que um flash loan realmente garante: um saldo durante a duração de uma transação, nada mais
* Por que sistemas de governança reais fazem checkpoint do poder de voto em vez de ler `balanceOf()` ao vivo
* A taxa não é de graça: descubra de onde ela precisa vir antes de pedir emprestado
* Você vai precisar de um contrato para este nível: quem empresta o flash loan chama de volta o `msg.sender`, o que só faz sentido se houver código ali para executar
