Bu seviyenin amacı, aşağıdaki basit [DEX](https://en.wikipedia.org/wiki/Decentralized_exchange) kontratını fiyat manipülasyonu ile hacklemen ve fonları çalman. 

10 adet `token1` ve 10 adet `token2` ile başlayacaksın. DEX kontratı ise iki tokenden de 100 adet ile başlıyor.
 
Eğer sözleşmeden en az birini (token1 ya da token2) tamamen boşaltmayı başarıp sözleşmenin varlıkların “kötü” bir fiyatını raporlamasına yol açarsan, bu seviyeyi geçersin.

&nbsp;
### Kısa not
Normalde bir ERC20 token ile swap yaparken sözleşmenin token’larını harcayabilmesi için önce `approve` etmen gerekir. Oyunun sözdizimine uyması için biz DEX kontratına `approve` metodunu ekledik. Yani token kontratlarını doğrudan çağırmak yerine şu komutu kullanabilirsin: `contract.approve(contract.address, <uint amount>)`. Bu, iki token için de istenen miktarda onay verecektir.`SwappableToken` kontratını ayrıca inceleyebilirsin ama zorunda değilsin. 

&nbsp;
Yardımcı olabilecek noktalar:
* Token fiyatı nasıl hesaplanıyor?
* `swap` metodu nasıl çalışıyor?
* Bir ERC20 işlemini `approve` ile nasıl onaylarsın? 
* Bir kontratla etkileşmenin birden fazla yolu vardır!
* Remix yardımcı olabilir.
* "At Address" ne işe yarar?
