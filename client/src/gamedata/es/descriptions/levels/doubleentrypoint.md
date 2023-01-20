Este nivel presenta una "CriptoBóveda" (`CryptoVault`) con una funcionalidad especial, la función `sweepToken`. Esta es una función común para recuperar tokens atascados en un contrato. `CryptoVault` opera con un token subyacente que no puede ser intercambiado, siendo este un importante componente en la lógica principal de `CryptoVault`. Cualquier otro token puede ser intercambiado.

El token subyacente es una instancia del token DET implementado en la definición del contrato `DoubleEntryPoint` y `CryptoVault` tiene 100 unidades. Además, `CryptoVault` también contiene 100 `LegacyToken LGT`.

En este nivel, deberás averiguar dónde está el error en `CryptoVault` y protegerlo para que sus tokens no sean drenados por completo.

El contrato incluye un contrato `Forta` donde cualquier usuario puede registrar su propio contrato `Bot de detección`. Forta es una red de monitoreo descentralizada, basada en la comunidad para detectar amenazas y anomalías en DeFi, NFT, governanza, puentes y otros sistemas Web3 tan pronto como se pueda. Tu trabajo es implementar un `Bot de detección` y registrarlo en el contrato `Forta`. La implementación del bot deberá generar alertas correctas para prevenir ataques potenciales o exploits de vulnerabilidades.

Cosas que podrían ayudar:
- ¿Cómo funciona un doble punto de entrada para un contrato de un token? 