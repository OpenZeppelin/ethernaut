GhostVault is a brand new yield vault. Deposit Deposit Tokens (DPT), get vault shares back, redeem your shares later for your share of whatever the vault is holding. Simple.

Bob, a real user, is about to deposit into this vault too. You've been given some DPT to try the vault out first.

Complete this level by making sure that, once Bob's deposit lands, your vault shares are worth strictly more than the DPT balance you started with, while Bob's are worth nothing.

&nbsp;
Things that might help
* The [ERC4626 Tokenized Vault](https://eips.ethereum.org/EIPS/eip-4626) standard, and how `deposit`/`redeem` convert between assets and shares
* What happens to a vault's share price when assets arrive without shares being minted for them
* Integer division in Solidity always rounds down
