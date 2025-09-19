Overflow hataları Solidity’de oldukça yaygındır ve mutlaka kontrol ifadeleriyle engellenmelidir, örneğin:
```
if(a + c > a) {
  a = a + c;
}
```

Bunun daha kolay bir yolu ise, tüm matematiksel operatörlerde taşmaları (overflow) otomatik olarak denetleyen OpenZeppelin SafeMath kütüphanesini kullanmaktır. Kod bu şekilde çok daha temiz görünür:
```
a = a.add(c);
``` 
Eğer bir overflow gerçekleşirse, işlem otomatik olarak revert eder (yani geri alınır).