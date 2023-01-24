En Solidity, para que un contrato pueda recibir ether, la función de fallback debe estar marcada como `payable`.

Sin embargo, no hay forma de evitar que un atacante envíe ether a un contrato a través de `selfdestruct`. Por lo tanto, es importante no contar con la invariante `address(this).balance == 0` para cualquier lógica de contrato.