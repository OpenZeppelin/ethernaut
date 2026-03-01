تهانينا! لقد فتحت بنجاح أسرار توقيعات المنحنى الإهليلجي (Elliptic Curve Signatures)!

كما هو موضح في [EIP-2](https://eips.ethereum.org/EIPS/eip-2)، فإن السماح بقيم `0 < s < secp256k1n` في منطق التحقق الخاص بنا، كما هو الحال حالياً، يفتح الباب أمام مخاوف تتعلق بـ **قابلية تطويع التوقيع (signature malleability)**. حيث يمكن لأي شخص أن يأخذ أي توقيع، ويقوم بقلب قيمة `s` من `s` إلى `secp256k1n - s` مع تغيير قيمة `v` (من 27 إلى 28، أو من 28 إلى 27)، وسينتج عن ذلك توقيع جديد يظل قادراً على استرداد نفس عنوان الموقع.

من الضروري استخدام تطبيقات آمنة ما لم تكن تعرف بالضبط ما تفعله. راجع [تطبيق OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/448efeea6640bbbc09373f03fbc9c88e280147ba/contracts/utils/cryptography/ECDSA.sol#L128-L154) لتعلم كيفية استخدام `ecrecover` بشكل آمن.