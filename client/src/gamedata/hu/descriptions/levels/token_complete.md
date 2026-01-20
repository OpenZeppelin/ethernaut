A túlcsordulások (overflows) nagyon gyakoriak a Solidity-ben, és ellenőrizni kell őket vezérlő utasításokkal, mint például:
```
if(a + c > a) {
  a = a + c;
}
```

Egy egyszerűbb alternatíva az OpenZeppelin SafeMath könyvtárának használata, amely automatikusan ellenőrzi a túlcsordulásokat az összes matematikai operátorban. Az eredményül kapott kód így néz ki:
```
a = a.add(c);
``` 
Ha van túlcsordulás, a kód visszavon (revert).
