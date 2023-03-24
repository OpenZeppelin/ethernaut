Como o nível anterior, `delegate` menciona, o uso de `delegatecall` para chamar
bibliotecas pode ser arriscado. Isso é particularmente verdadeiro para bibliotecas que
têm seu próprio estado. Este exemplo demonstra porque a palavra-chave `library`
deve ser usada para construir bibliotecas, pois evita que as bibliotecas
armazenem e acessem variáveis ​​de estado.