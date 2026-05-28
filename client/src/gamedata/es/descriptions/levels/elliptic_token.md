BOB creó y es propietario de un nuevo token ERC20 con un sistema de canje de cupones firmados basado en curvas elípticas llamado EllipticToken ($ETK). Bob puede crear cupones off-chain que luego pueden ser canjeados on-chain por $ETK. El contrato también incluye un sistema de permisos basado en firmas de curvas elípticas.

Bob es un desarrollador perezoso y "optimizó" algunos pasos del algoritmo ECDSA. ¿Puedes encontrar la falla?

Tu objetivo es robar los tokens $ETK que ALICE (`0xA11CE84AcB91Ac59B0A4E2945C9157eF3Ab17D4e`) acaba de canjear.

Cosas que podrían ayudar:

- Busca cualquier paso que falte en el [Algoritmo de Firma Digital de Curva Elíptica (ECDSA)](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm).

Buena suerte. Las curvas elípticas no perdonan la confusión de dominios.