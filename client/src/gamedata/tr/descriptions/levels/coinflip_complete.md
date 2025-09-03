Rastgele sayı üretmek Solidity’de zor olabilir. Şu anda yerleşik (native) bir yöntem yok ve akıllı kontratlarda kullandığın her şey herkes tarafından görülebilir; buna “private” olarak işaretlenmiş yerel değişkenler ve durum değişkenleri de dahil. Miner’lar ayrıca blockhash, timestamp gibi değerler üzerinde ve hangi işlemleri dahil edeceklerine karar verme konusunda kontrol sahibidir; bu da onların bu değerleri kendi lehlerine yönlendirmelerine olanak tanır.

Kriptografik olarak doğrulanmış rastgele sayılar elde etmek için [Chainlink VRF](https://docs.chain.link/docs/get-a-random-number) kullanabilirsin. Bu sistem bir oracle, LINK tokeni ve zincir üzerindeki bir kontrat aracılığıyla sayının gerçekten rastgele olduğunu doğrular. 

Diğer bazı seçenekler şunlardır: Bitcoin blok başlıklarını kullanmak (doğrulama için [BTC Relay](http://btcrelay.org)), [RANDAO](https://github.com/randao/randao), or [Oraclize](http://www.oraclize.it/)).
