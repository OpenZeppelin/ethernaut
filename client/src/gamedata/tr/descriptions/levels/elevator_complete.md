Bir arayüzde `view` fonksiyon belirleyicisini kullanarak durum (state) değişikliklerini önleyebilirsin. `pure` değiştiricisi de fonksiyonların durumu değiştirmesini engeller.
[Solidity dokümantasyonunu](http://solidity.readthedocs.io/en/develop/contracts.html#view-functions) mutlaka oku ve bu konudaki ince noktaları öğren.

Bu seviyeyi çözmenin alternatif bir yolu da, girdiye (input) bağlı olarak farklı sonuçlar döndüren fakat durumu değiştirmeyen bir view fonksiyonu yazmaktır, örneğin `gasleft()`.

