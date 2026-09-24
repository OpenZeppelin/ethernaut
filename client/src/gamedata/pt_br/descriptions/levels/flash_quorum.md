Uma pequena DAO tem um pequeno tesouro, protegido por uma única regra: quem chamar `executeProposal` precisa ter pelo menos 50% do supply do token de governança. Você recebeu um pequeno saldo inicial, longe o suficiente de alcançar o quórum apenas segurando-o, e nem comprar o restante nem recebê-lo de presente é uma opção.

Complete este nível drenando o tesouro.

&nbsp;
Coisas que podem ser úteis
* Veja o que mais o token de governança pode fazer além de `transfer` e `approve`
* A taxa não é de graça: descubra de onde ela precisa vir antes de pedir emprestado
* Você vai precisar de um contrato para este nível: quem empresta o flash loan chama de volta o `msg.sender`, o que só faz sentido se houver código ali para executar
