Este nivel te guiará a través de los conceptos básicos de cómo jugar.

&nbsp;
#### 1. Configurar MetaMask
Si aún no lo tienes, instala la [extensión del navegador MetaMask](https://metamask.io/).
Configura la billetera de la extensión y usa el selector de red para apuntar a la 'Red de prueba de Rinkeby' en la parte superior izquierda de la interfaz de la extensión.

&nbsp;
#### 2. Abre la consola del navegador
Abre la consola de tu navegador: `Herramientas > Herramientas de desarrollo`.

Deberías ver algunos mensajes del juego. Uno de ellos debe indicar la dirección de tu jugador. ¡Esto será importante durante el juego! Siempre puedes ver la dirección de tu jugador ingresando el siguiente comando:

```
player
```

Quedate atento a las advertencias y errores, ya que podrían proporcionar información relevante durante el juego.

&nbsp;
#### 3. Usa los helpers de la consola

También puedes ver tu saldo actual de ether escribiendo:
```
getBalance(player)
```
###### NOTA: expande la promesa para ver el valor actual, incluso si dice "pending". Si estás usando Chrome v62, puedes usar "await getBalance (player)" para una experiencia más limpia.

¡Estupendo! Para ver qué otras funciones de utilidad tiene en la consola, escribe:
```
help()
```
Esto será muy útil durante el juego.

&nbsp;
#### 4. El contrato ethernaut
Ingresa el siguiente comando en la consola:

```
ethernaut
```

Este es el principal contrato inteligente del juego. No necesitas interactuar con él directamente a través de la consola (ya que esta aplicación lo hará por ti), pero puedes hacerlo si lo deseas. Jugar con este objeto es una excelente manera de aprender a interactuar con los otros contratos inteligentes del juego.

Continúa y expande el objeto ethernaut para ver qué hay dentro.

&nbsp;
#### 5. Interactuar con el ABI
`ethernaut` es un objeto `TruffleContract` que envuelve el contrato `Ethernaut.sol` que se ha implementado en la red.

Entre otras cosas, el ABI del contrato expone todos los métodos públicos de `Ethernaut.sol`,  como `owner`. Escribe el siguiente comando, por ejemplo:
```
ethernaut.owner()
```

###### `await ethernaut.owner ()` si estás usando Chrome v62.
Puedes ver quién es el propietario del contrato de ethernaut, que no eres tú, por supuesto =D.

&nbsp;
#### 6. Obtén el ether de prueba
Para jugar, necesitarás algunos ethers de prueba. La forma más fácil de obtener testnet ethers es a través de [este faucet](https://faucet.rinkeby.io/).

Una vez que veas algo de ether en su saldo, continúa con el siguiente paso.

&nbsp;
#### 7. Obtener una instancia de nivel
Al jugar un nivel, no interactúas directamente con el contrato de ethernaut. En su lugar, le pides que genere una **instancia de nivel** para ti. Para hacerlo, haz clic en el botón azul en la parte inferior de la página. ¡Hazlo ahora y vuelve!

MetaMask debería solicitarle que autorices la transacción. Hazlo y deberías ver algunos mensajes en la consola. Ten en cuenta que esto está implementando un nuevo contrato en la red y puede demorar unos segundos, ¡así que ten paciencia al solicitar nuevas instancias!

&nbsp;
#### 8. Inspección del contrato
Tal como lo hiciste con el contrato de ethernaut, puedes inspeccionar el ABI de este contrato a través de la consola usando la variable `contract`.

&nbsp;
#### 9. Interactúa con el contrato para completar el nivel
Mira el método de información de los niveles
```
contract.info ()
```

###### `await contract.info ()` si estás usando Chrome v62.

Deberías tener todo lo que necesita para completar el nivel dentro del contrato.
Cuando sepas que has completado el nivel, envía el contrato utilizando el botón naranja en la parte inferior de la página.
Esto envía su instancia de nuevo a ethernaut, que determinará si lo has completado.

##### Sugerencia: ¡no olvides que siempre puedes buscar en el ABI del contrato!