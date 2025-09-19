import random
from eth_utils import keccak, to_checksum_address
from sympy import mod_inverse
from ecutils.curves import get as get_curve
from ecutils.core import Point
from libnum import sqrtmod

secp256k1 = get_curve('secp256k1')


def main():
    ### Step 1: Recover Alice's public key from the signature  sent as redeemVoucher function call argument receiverSignature that was made when the contract was deployed.
    r = 0xab1dcd2a2a1c697715a62eb6522b7999d04aa952ffa2619988737ee675d9494f 
    s = 0x2b50ecce40040bcb29b5a8ca1da875968085f22b7c0a50f29a4851396251de12
    alice_address = "0xA11CE84AcB91Ac59B0A4E2945C9157eF3Ab17D4e"
    voucherHash = "0x87f1c8cd4c0e19511304b612a9b4996f8c2bd795796636bd25812cd5b0b6a973"

    # First, you find the two points R, R′ which have the value r as the x-coordinate. 
    # y is a value such that the curve equation is satisfied y = modular_sqrt(x³ + 7 (mod p)) for secp256k1 curve.
    R_y = modular_sqrt(r**3 + 7, secp256k1.p)
    R_y_p = secp256k1.p - R_y
    R = Point(r, R_y)
    R_p = Point(r, R_y_p)

    # Then, you can recover two public keys using the formula:
    # pub_k_0 = r⁻¹ · (s · R − (h · G))
    # pub_k_1 = r⁻¹ · (s · R_p − (h · G))
    h_G = secp256k1.multiply_point(int(voucherHash, 16), secp256k1.G)
    h_G_neg = Point(h_G.x, secp256k1.p - h_G.y)
    r1 = mod_inverse(r, secp256k1.n) 
    s_R = secp256k1.multiply_point(s, R)
    s_R_p = secp256k1.multiply_point(s, R_p)

    pub_k_0 = secp256k1.multiply_point(r1, secp256k1.add_points(s_R, h_G_neg))
    pub_k_1 = secp256k1.multiply_point(r1, secp256k1.add_points(s_R_p, h_G_neg))

    # One of the recovered public keys should match Alice's address
    def eth_address_from_xy(pub_k: Point) -> str:
        x_bytes = pub_k.x.to_bytes(32, "big")
        y_bytes = pub_k.y.to_bytes(32, "big")
        pubkey_bytes = x_bytes + y_bytes
        addr_bytes = keccak(pubkey_bytes)[-20:]
        return to_checksum_address("0x" + addr_bytes.hex())
    
    alice_pub_k = None
    if eth_address_from_xy(pub_k_0) == alice_address:
        alice_pub_k = pub_k_0
    elif eth_address_from_xy(pub_k_1) == alice_address:
        alice_pub_k = pub_k_1
    else:
        raise Exception("No public key found for Alice's address")
    print("Alice's public key: ", alice_pub_k)

    ### Step 2: Since we already have Alice’s public key, we can generate a valid signature for any arbitrary message hash. The contract does not use a hash of the amount as the message, instead, it uses the amount itself as the message hash for ECDSA recovery. This means we don’t need to know the original pre-image of the amount hash just the amount value since it directly serves as the input for signature verification. See: https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm#Signature_verification_algorithm

    # We can pick two random u_1, u_2 in the range [1, n-1] where n is the order of the curve
    u_1, u_2 = random.randint(1, secp256k1.n -1), random.randint(1, secp256k1.n -1)

    # Then we compute the curve point P_1 = (x_1 , y_1) = u_1·G + u_2·alice_pub_k
    a = secp256k1.multiply_point(u_1, secp256k1.G)
    b = secp256k1.multiply_point(u_2, alice_pub_k)
    P_1 = secp256k1.add_points(a, b)
    y_1_parity = P_1.y & 1

    # The spoofed signature will be valid if r = x_1 (mod n), with this constrain we can compute s and e (the random hash of the message) for the spoofed signature.
    # since:
    # u_1 = s⁻¹ · e (mod n)
    # u_2 = s⁻¹ · r (mod n)
    # therefore:
    # s = r · u_2⁻¹ (mod n)
    # e = r · u_1 · u_2⁻¹ (mod n)
    r = P_1.x % secp256k1.n
    s = (r * mod_inverse(u_2, secp256k1.n)) % secp256k1.n
    e = (r * u_1 * mod_inverse(u_2, secp256k1.n)) % secp256k1.n

    # As last step we need to fix the s parity if needed to bypass OZ ECDSA signature malleability check and generate the corresponding v. See: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/c64a1edb67b6e3f4a15cca8909c9482ad33a02b0/contracts/utils/cryptography/ECDSA.sol#L134-L145

    if s > secp256k1.n // 2:
        s = secp256k1.n - s
        y_1_parity = 1 - y_1_parity
        
    v = y_1_parity + 27  # v is either 27 or 28

    print("Spoofed signature")
    print("r:", hex(r))
    print("s:", hex(s))
    print("v:", v)
    print("amount (message hash):", hex(e))


# Modular square root function using Tonelli-Shanks algorithm https://gist.github.com/nakov/60d62bdf4067ea72b7832ce9f71ae079
def modular_sqrt(a, p):
    def legendre_symbol(a, p):
        ls = pow(a, (p - 1) // 2, p)
        return -1 if ls == p - 1 else ls
    if legendre_symbol(a, p) != 1:
        return 0
    elif a == 0:
        return 0
    elif p == 2:
        return p
    elif p % 4 == 3:
        return pow(a, (p + 1) // 4, p)
    s = p - 1
    e = 0
    while s % 2 == 0:
        s //= 2
        e += 1
    n = 2
    while legendre_symbol(n, p) != -1:
        n += 1
    x = pow(a, (s + 1) // 2, p)
    b = pow(a, s, p)
    g = pow(n, s, p)
    r = e
    while True:
        t = b
        m = 0
        for m in range(r):
            if t == 1:
                break
            t = pow(t, 2, p)
        if m == 0:
            return x
        gs = pow(g, 2 ** (r - m - 1), p)
        g = (gs * gs) % p
        x = (x * gs) % p
        b = (b * g) % p
        r = m

if __name__ == "__main__":
    main()