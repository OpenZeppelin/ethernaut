Alice confió en ti un allowance de 100 tokens ALT sobre su cuenta. Desde entonces decidió que eso es demasiado generoso para un spender que apenas conoce, y está a punto de reducirlo a un más prudente 10.

Completa este nivel terminando con más tokens ALT de los 10 que Alice está a punto de dejarte.

&nbsp;
Cosas que pueden ayudar
* El modelo de allowance `approve`/`transferFrom` de [ERC20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md)
* Qué hace realmente `approve()` con el valor de allowance guardado: ¿suma, resta, o simplemente lo sobrescribe?
* Nada impide que un spender llame `transferFrom` más de una vez
