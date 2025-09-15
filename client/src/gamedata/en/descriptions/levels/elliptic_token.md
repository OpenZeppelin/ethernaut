BOB created and owns a new ERC20 token with an elliptic curve–based signed voucher redemption system called EllipticToken ($ETK). Bob can create vouchers off-chain that can be redeemed on-chain for $ETK. The contract also includes a permit system based on elliptic curve signatures.

Bob is a lazy developer and “optimized” some steps of the ECDSA algorithm. Can you find the flaw?

Your goal is to steal the $ETK tokens that ALICE (`0xA11CE84AcB91Ac59B0A4E2945C9157eF3Ab17D4e`) just redeemed.

&nbsp;
Things that might help:
* Look for any missing step in the [Elliptic Curve Digital Signature Algorithm (ECDSA)](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm).

Good luck. Elliptic curves do not forgive domain confusion.