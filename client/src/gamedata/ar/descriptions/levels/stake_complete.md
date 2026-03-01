تهانينا، لقد قمت باختراق آلة `Stake`!

عند إجراء نداءات منخفضة المستوى (low-level calls) لعقود خارجية، من المهم التحقق من صحة نتائج النداء الخارجي بشكل صحيح لتحديد ما إذا كان النداء قد تراجع (reverted).

لمزيد من المعلومات، راجع متطلب [EEA EthTrust [S] Check External Calls Return](https://entethalliance.github.io/eta-registry/security-levels-spec.html#req-1-check-return)، واستخدم دائماً [SafeERC20](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/utils/SafeERC20.sol) عند التعامل مع رموز ERC-20 الخارجية.