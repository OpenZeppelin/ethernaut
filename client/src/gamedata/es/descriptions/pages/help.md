&nbsp;
#### Mecanica del juego

El juego utiliza el contrato principal `Ethernaut.sol` para gestionar el progreso del jugador y delegar la interacción con las implementaciones de `Level.sol`. Cada contrato de nivel emite cada vez nuevas instancias para que los jugadores manipulen, rompan, destruyan, corrijan, etc. El jugador solicita una instancia, la manipula y la devuelve al juego para evaluar el nivel completado. Las acciones para generar una nueva instance y/o devolverla manipulada al juego se realizan con los botones en la interfaz de usuario en cada nivel. Cuando esta aplicación recupera una instancia de `Ethernaut.sol`, la envuelve en un objeto `TruffleContract` y la expone en la consola del navegador.Consulta el primer nivel para ver un tutorial completo sobre cómo jugar al juego.

&nbsp;
#### Usando la consola del navegador

La mayor parte de la interaccion con el juego se puede realizar atravès de la consola del navegador: `Dev Tools -> Console`. Habra la consola y introduzca el siguiente comando:
```
help()
```

Para ver un listado de objectos y funciones proporcionadas por el juego en la consola.

La mayoria de las interacciones son asyncronas, por eso recomendamos usar Chrome >v62 que permite usar la syntaxis `async/await` en la consola. Asi en vez de escribir:
```
getBalance(player)
> PROMISE
```
y abrir la PROMISE.

Con await/async, puedes escribir:
```
await getBalance(player)
> "1.11002387"
```

&nbsp;
#### Mas alla que la consola

Algunos niveles requieriran trabajar fuera de la consola del navegador. A veces, serà necesario escribir codigo en Solidity y deployarlo en la misma red para poder atacar una instancia de un nivel atraves de un contrat. Eso se puede realizar de dos maneras:

1) Usando Remix para escribir el codigo y deployarlo en la misma red [Remix Solidity IDE](https://remix.ethereum.org/).
2) Configura un proyecto Truffle en local para desarollar y deployar el contrato para ejecutar el ataque [Truffle Framework](http://truffleframework.com/).

&nbsp;
#### Resoluciones de incidencias

En algunos casos, el estado de la app o directamente Metamask pueden emitir errores inesperados, sobretodo cuando nos cambiamos entre varias redes o conectamos diferentes wallets.

Si lo que ves no tiene mucho sentido prueba a refrescar la app, desabilitando y reabilitando Metamask o reiniciando el browser.

Si sigues teniendo algunos problemas, puedes abrir un issue en nuestro repositorio de Github o bien mandar un mail a ethernaut@zeppelin.solutions.
