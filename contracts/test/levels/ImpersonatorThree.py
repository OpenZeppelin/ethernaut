# The key of the level is to recover Bob's private key to steal the funds.

import random
from ecdsa import VerifyingKey, SECP256k1
from ecdsa.ecdsa import Signature
from ecdsa.ellipticcurve import Point
from eth_utils import keccak, to_checksum_address

ALICE_PUBLIC_KEY = "02fe53640dfc3276d22d504b3d16504eaa1d81e1b0d5f2cb60117f9acb7fd03a50"
ALICE_ADDRESS = "0xAf1F2d124093d2D5C24b6dFf1caeC8f0f8c3Cf95"

def format_s(s: int) -> int:
    if s > SECP256k1.order // 2:
        s = SECP256k1.order - s

    return s

def pubkey_to_address(pubkey: str) -> str:
    public_key_bytes = bytes.fromhex(pubkey)

    pubkey_hash = keccak(public_key_bytes)
    return to_checksum_address(pubkey_hash[-20:])

if __name__ == "__main__":
    G = SECP256k1.generator
    n = SECP256k1.order

    vk = VerifyingKey.from_string(bytes.fromhex(ALICE_PUBLIC_KEY), curve=SECP256k1)
    assert  pubkey_to_address(vk.to_string("raw").hex()) == ALICE_ADDRESS, "Alice's public key does not match the expected address"

    x = int(vk.to_string("uncompressed").hex()[2:66], base=16)
    y = int(vk.to_string("uncompressed").hex()[66:], base=16)

    # See Signature verification algorithm at https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm
    a, b = random.randint(1, n -1), random.randint(1, n -1)
    R = a * G + b * Point(SECP256k1.curve, x, y) # See step 5
    r = R.x() % n # Condition for the signature to be valid
    s = r * pow(b, -1, n) % n # See step 4
    z = a * s % n # See step 4

    sig, found = Signature(r=r, s=s), False
    for pk in sig.recover_public_keys(hash=z, generator=G):
        if pk.point.x() == x and pk.point.y() == y:
            found = True
            break
    assert found, "Target public key not found in recovered signatures"

    r = hex(sig.r)[2:].rjust(64, '0')
    s = hex(format_s(sig.s))[2:].rjust(64, '0')
    print(f"Signature (without 'v'): 0x{r}{s}")
    print(f"Message 0x{hex(z)[2:].rjust(64, '0')}")
