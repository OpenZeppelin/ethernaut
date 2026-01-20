Bár ez a példa egyszerű lehet, a `tx.origin` és a `msg.sender` összekeverése adathalász-szerű támadásokhoz vezethet, mint például [ez](https://blog.ethereum.org/2016/06/24/security-alert-smart-contract-wallets-created-in-frontier-are-vulnerable-to-phishing-attacks/).

Egy lehetséges támadás példája az alábbiakban látható.

1) Használd a `tx.origin`-t annak meghatározására, kinek a tokenjeit kell átutalni, pl.

```
function transfer(address _to, uint _value) {
  tokens[tx.origin] -= _value;
  tokens[_to] += _value;
}
```
2) A támadó ráveszi az áldozatot, hogy pénzt küldjön egy rosszindulatú szerződésnek, amely meghívja a token szerződés átutalási funkcióját, pl.

```
function () payable {
  token.transfer(attackerAddress, 10000);
}
```

3) Ebben a forgatókönyvben a `tx.origin` az áldozat címe lesz (míg a `msg.sender` a rosszindulatú szerződés címe lesz), aminek eredményeként a pénzeszközök az áldozattól a támadóhoz kerülnek.
