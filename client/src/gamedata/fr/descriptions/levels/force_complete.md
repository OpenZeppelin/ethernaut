Dans Solidity, pour qu'un contrat puisse recevoir de l'éther, la fonction de fallback doit être marquée "payable".

However, there is no way to stop an attacker from sending ether to a contract by self destroying. Hence, it is important not to count on the invariant `address(this).balance == 0` for any contract logic.
