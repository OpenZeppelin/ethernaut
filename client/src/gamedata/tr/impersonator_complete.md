Tebrikler! Eliptik eğri imzalarının sırlarını başarıyla çözdün!

[EIP-2'de](https://eips.ethereum.org/EIPS/eip-2), açıklandığı gibi, doğrulama mantığımızda şu an izin verilen `0 < s < secp256k1n` aralığı imza esnekliği (malleability) sorununa açık kapı bırakıyor. Bir imzayı alıp `s` değerini `s`’den `secp256k1n - s`’ye çevirip `v` değerini değiştirdiğinde (27 -> 28, 28 -> 27), ortaya çıkan imza aynı imzacıyı yine geri çıkaracaktır.

Ne yaptığını tam bilmiyorsan güvenli uygulamalar kullanmak önemli. ecrecover’ı güvenli kullanmayı öğrenmek için [OpenZeppelin implementasyonuna](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/448efeea6640bbbc09373f03fbc9c88e280147ba/contracts/utils/cryptography/ECDSA.sol#L128-L154) bak.