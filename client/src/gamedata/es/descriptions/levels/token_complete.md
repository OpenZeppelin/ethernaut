Los overflows son muy comunes en Solidity y deben verificarse con controles como:
```
if(a + c > a) {
  a = a + c;
}
```

Una alternativa más sencilla es utilizar la librería SafeMath de OpenZeppelin, que comprueba automáticamente si hay overflows en todos los operadores matemáticos. El código resultante se ve así:
```
if(a + c > a) {
   a = a + c;
}
```
Si hay un overflow, el código hará revert.