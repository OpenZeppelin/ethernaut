Overflows são muito comuns em solidity e devem ser verificados com estruturas de controle como:
```
if(a + c > a) {
  a = a + c;
}
```

Uma alternativa mais fácil é usar a biblioteca SafeMath da OpenZeppelin, que verifica automaticamente se há overflows em todos os operadores matemáticos. O código resultante se parece com isso:
```
a = a.add(c);
``` 
Se houver um overflow, o código será revertido.
