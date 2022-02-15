Bu seviye, EVM'nin bir dizinin (array) ABI-encoded uzunluğunu gerçek yüküne karşı doğrulamadığı gerçeğinden yararlanır.

Ek olarak, dizinin (array) sınırlarını tüm `2^256` depolama alanına genişleterek dizi uzunluğunun aritmetik taşmasını kullanır. Kullanıcı daha sonra tüm sözleşme depolamasını değiştirebilir.


Her iki güvenlik açığı da 2017'nin [Gereksiz kodlama yarışması]'ndan esinlenmiştir. (https://medium.com/@weka/announcing-the-winners-of-the-first-underhanded-solidity-coding-contest-282563a87079)