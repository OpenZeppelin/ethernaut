Em solidity, para que um contrato possa receber ether, a função de fallback deve ser marcada como `payable`.

No entanto, não há como impedir que um invasor envie ether para um contrato por meio da autodestruição. Portanto, é importante não contar com a invariante `address(this).balance == 0` para qualquer lógica de contrato.