Bu seviye, sabit bir gas miktarı belirtilmediğinde bilinmeyen dış kontrat çağrılarının hâlâ hizmet engelleme (DoS) saldırı vektörleri yaratabileceğini gösterir.

Eğer bir dış çağrı revert ettiğinde işlem akışına devam etmek için low-level `call` kullanıyorsan, mutlaka sabit bir gas ödeneği (gas stipend) belirt. Örneğin: `call.gas(100000).value()`.

Genellikle re-entrancy saldırılarını önlemek için [checks-effects-interactions](http://solidity.readthedocs.io/en/latest/security-considerations.html#use-the-checks-effects-interactions-pattern) desenini izlemelisin, ancak fonksiyonun sonunda birden fazla dış çağrı yapılması gibi başka durumlarda da benzer sorunlar ortaya çıkabilir.

*Not*: Bir dış `CALL`, o an kullanılabilir gazın en fazla 63/64 oranını kullanabilir.
Bu yüzden, tamamlanması gereken opcode’lar için kalan gaz miktarına bağlı olarak, yeterince yüksek gazlı bir işlem (yani kalan 1/64’lük gazın üst düzey çağrıyı tamamlayabilecek kadar olduğu bir işlem) bu özel saldırıya karşı bir dereceye kadar korunma sağlayabilir.