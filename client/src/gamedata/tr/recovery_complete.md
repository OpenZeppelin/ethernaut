
Sözleşme adresleri deterministiktir ve `keccak256(address, nonce)` formülüyle hesaplanır. Burada `address`, işlemi veya sözleşmeyi oluşturan Ethereum adresini, `nonce` ise oluşturulan sözleşme sayısını (ya da normal işlemler için işlem nonce’unu) ifade eder.

Bu nedenle, biri özel anahtarı olmayan, önceden belirlenmiş bir adrese ether gönderebilir ve daha sonra o adreste bir sözleşme oluşturarak gönderilen ether’i geri alabilir. Bu yöntem, özel anahtar tutmadan ether saklamanın sezgisel olmayan ve biraz gizemli (ve tehlikeli) bir yoludur.

Martin Swende’nin bu konudaki olası kullanım alanlarını anlattığı ilginç bir [blog yazısı](https://swende.se/blog/Ethereum_quirks_and_vulns.html) mevcut. 

Bu tekniği kullanmayı düşünüyorsan, nonce’u kaçırmadığından emin ol, aksi takdirde fonların sonsuza kadar kaybolur.