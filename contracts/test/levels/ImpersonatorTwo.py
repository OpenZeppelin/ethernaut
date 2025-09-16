from sympy import mod_inverse
from ecutils.curves import get as get_curve
from ecdsa import SigningKey, SECP256k1

secp256k1 = get_curve('secp256k1')

# During the deployment of the instance two signatures from the OWNER private key are used:
# SWITCH_LOCK_SIG:
r_1 = 0xe5648161e95dbf2bfc687b72b745269fa906031e2108118050aba59524a23c40
s_1 = 0x70026fc30e4e02a15468de57155b080f405bd5b88af05412a9c3217e028537e3
z_1 = 0x937fa99fb61f6cd81c00ddda80cc218c11c9a731d54ce8859cb2309c77b79bf3
# SET_ADMIN_SIG:
r_2 = 0xe5648161e95dbf2bfc687b72b745269fa906031e2108118050aba59524a23c40 
s_2 = 0x4c3ac03b268ae1d2aca1201e8a936adf578a8b95a49986d54de87cd0ccb68a79
z_2 = 0x6a0d6cd0c2ca5d901d94d52e8d9484e4452a3668ae20d63088909611a7dccc51

# As can be seen, the r values are the same, meaning that the same random k was used to sign both messages.
# This is a critical vulnerability in ECDSA, as it allows the recovery of the private key (see the Play Station 3 EDCSA vulnerability).

# According to the ECDSA signature generation algorithm:
# https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm#Signature_generation_algorithm. 
 
# s_1 = k^(-1) * (z_1 + r_1 * owner_sk) mod n
# s_2 = k^(-1) * (z_2 + r_2 * owner_sk) mod n

# r_1 = r_2 = r
r = r_1

# From which we can derive k:
# s_1 - s_2 = k^(-1) * (z_1 + r * owner_sk) - k^(-1) * (z_2 + r * owner_sk) mod n 
# s_1 - s_2 = k^(-1) * (z_1 + r * owner_sk - z_2 - r * owner_sk) mod n
# s_1 - s_2 = k^(-1) * (z_1 - z_2) mod n
# k = (s_1 - s_2)^(-1) * (z_1 - z_2) mod n
k = mod_inverse(s_1 - s_2, secp256k1.n) * (z_1 - z_2) % secp256k1.n

# Once k is known, we can recover the private key:
# owner_sk = r^(-1) * (s_1 * k - z_1) mod n
owner_sk = mod_inverse(r, secp256k1.n) * (s_1 * k - z_1) % secp256k1.n


# Then we can generate valid signatures to unlock the contract and change the admin to ourselves.
sk = SigningKey.from_string(bytes.fromhex(hex(owner_sk)[2:]), curve=SECP256k1)

## Generate Set Admin signature
SET_ADMIN_2_DIGEST = "a697d71f95302311583a240bee39aefcf3eb87df3ee1ca2f3001e038fde9922e"

set_admin_2_signature = sk.sign_digest(bytes.fromhex(SET_ADMIN_2_DIGEST), k=k)
sa_r, sa_s = set_admin_2_signature.hex()[0:64], set_admin_2_signature.hex()[64:128]
if sa_s > hex(SECP256k1.order // 2)[2:]:
    sa_s = hex(SECP256k1.order - int(sa_s, base=16))[2:]

print("set admin r:", sa_r)
print("set admin s:", sa_s)

## Generate Switch Lock signature
SWITCH_LOCK_3_DIGEST = "22e1cf10d1c8bed2463521c56b4047a50cff188a411bf5c94f820e244eb01d35"

switch_lock_3_signature = sk.sign_digest(bytes.fromhex(SWITCH_LOCK_3_DIGEST), k=k)
sl_r, sl_s = switch_lock_3_signature.hex()[0:64], switch_lock_3_signature.hex()[64:128]

if sl_s > hex(SECP256k1.order // 2)[2:]:
    sl_s = hex(SECP256k1.order - int(sl_s, base=16))[2:]

print("switch lock r:", sl_r)
print("switch lock s:", sl_s)