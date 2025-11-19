You haveve shown why storing raw signatures isn’t enough, they can sneak past with replays or alternate encodings.

The safer route is to use a nonce system to tie each mint to a unique action.
This ensures every signature can only be spent once, no matter how it’s encoded.

EIP-2098 short signatures? Handle them with care, normalize before trusting.

Congrats, you have mastered the art of not being forged yourself. 🔐