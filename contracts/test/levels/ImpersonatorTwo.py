# The key of the level is to recover Bob's private key to steal the funds.

from ecdsa import SigningKey, SECP256k1

def sign(sk: SigningKey, digest: str, k: int) -> str:
    signature = sk.sign_digest(bytes.fromhex(digest), k=k)
    r, s = signature.hex()[0:64], signature.hex()[64:128]
    return r, s

def format(r: str, s: str, v: int) -> str:
    return f"0x{r.rjust(64, '0')}{s.rjust(64, '0')}{hex(v)[2:]}"

def recover_nonce(r: str, s1: str, s2: str, z1: str, z2: str) -> int:
    r = int(r, base=16)
    s1 = int(s1, base=16)
    s2 = int(s2, base=16)
    z1 = int(z1, base=16)
    z2 = int(z2, base=16)

    k = (pow(s1 - s2, -1, SECP256k1.order) * (z1 - z2)) % SECP256k1.order
    return k

def recover_private_key(r: str, s1: str, z1: str) -> int:
    r = int(r, base=16)
    s1 = int(s1, base=16)
    z1 = int(z1, base=16)

    return pow(r, -1, SECP256k1.order) * (s1 * k - z1) % SECP256k1.order


BOB_PRIVATE_KEY = "e4d0b5fd9c55a969c4dee74f6d1ee740b605cbfb28f911d116fde8db69aea357"
LOCK0_DIGEST = "937fa99fb61f6cd81c00ddda80cc218c11c9a731d54ce8859cb2309c77b79bf3"
ADMIN1_DIGEST = "05a808dc03119733a8318be19b57143c08e0f059b411aa2d4ff0b89ca306c48f"
NONCE = 666

if __name__ == "__main__":
    sk = SigningKey.from_string(bytes.fromhex(BOB_PRIVATE_KEY), curve=SECP256k1)

    signature = sk.sign_digest(
        bytes.fromhex(LOCK0_DIGEST),
        k = 666
    )

    r1, s1 = sign(sk, LOCK0_DIGEST, NONCE)
    lock_signature = format(r1, s1, 28) # 28 from empirical tests
    print("Lock signature", lock_signature)

    r2, s2 = sign(sk, ADMIN1_DIGEST, NONCE)
    # s2 needs to be flipped to be valid
    s2_flipped = hex(SECP256k1.order - int(s2, base=16))[2:]
    admin_signature = format(r2, s2_flipped, 27) # 27 from empirical tests
    print("Admin signature: ", admin_signature)

    assert r1 == r2, "r values must match"
    k = recover_nonce(
        r1,
        s1,
        s2, # we have to use the original s2
        LOCK0_DIGEST,
        ADMIN1_DIGEST
    )
    assert k == NONCE, "nonce couldn't be recovered"

    private_key = recover_private_key(r1, s1, LOCK0_DIGEST)
    assert private_key == int(BOB_PRIVATE_KEY, base=16), "private key couldn't be recovered"
