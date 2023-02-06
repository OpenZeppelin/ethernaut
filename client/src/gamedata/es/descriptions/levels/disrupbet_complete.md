
Muy bien, pudiste cobrar tu apuesta.!! Te felicito. Seguro que pensaste que es un error muy tonto este que acabas de vulnerar, ¿verdad? Pero no te creas estos errores básicos se comenten muy de seguido y existen muchos contratos vulnerables por un simple descuido. Son errores que un test básico no detectaria. Así que de ahora en adelante fíjate muy bien en los detalles para que no te pase. 

```
 //------- MODIFIERS ----------
    modifier onlyOwner() {
        require(msg.sender == owner, "Onlyowner: user not owner");
        _;
    }
 //  Falto el onlyOwner en esta función

 function setDateFinish(uint256 newDate) external   <--------- Error: onlyOwner  //
    {
        START_WORLDCUP_FINALMATCH = newDate;
    }

```

