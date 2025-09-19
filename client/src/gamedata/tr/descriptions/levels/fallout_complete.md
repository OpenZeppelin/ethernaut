Epey saçmaydı, değil mi? Gerçek dünyadaki sözleşmeler bundan çok daha güvenli olmalı ve dolayısıyla onları hacklemek de çok daha zor olmalı, dimi?

Pek de öyle değil...

Ethereum ekosisteminde çok bilinen Rubixi vakası tam da bunun bir örneği. Şirket, adını 'Dynamic Pyramid'den 'Rubixi' olarak değiştirdi, ancak sözleşmenin kurucu (constructor) metodunun ismini değiştirmeyi unuttu::

```
contract Rubixi {
  address private owner;
  function DynamicPyramid() { owner = msg.sender; }
  function collectAllFees() { owner.transfer(this.balance) }
  ...
```

Bu durum saldırganın eski kurucu fonksiyonu çağırıp sözleşmenin sahipliğini ele geçirmesine ve tüm fonları çalmasına izin verdi. Evet, akıllı sözleşmeler diyarında çok büyük hatalar yapılabiliyor.