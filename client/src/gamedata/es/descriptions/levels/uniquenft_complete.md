¿Pensaste que `tx.origin == msg.sender` te salvaría de las llamadas de contratos inteligentes? Ya no.

Con el EIP-7702, una EOA puede adoptar un comportamiento similar al de un contrato, delegar llamadas y eludir esa vieja validación. La suposición de que las EOAs no pueden reentrar en una función es ahora más peligrosa que nunca.

Al hacer reentrada en `mintNFTEOA` desde el callback `onERC721Received`, puedes mintear tantos NFT como quieras. De repente, una sola insignia no es el límite, es solo el comienzo.