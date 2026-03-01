على الرغم من أن هذا المثال قد يكون بسيطاً، إلا أن الخلط بين `tx.origin` و `msg.sender` قد يؤدي إلى هجمات بنمط التصيد (phishing)، مثل [هذا الهجوم](https://blog.ethereum.org/2016/06/24/security-alert-smart-contract-wallets-created-in-frontier-are-vulnerable-to-phishing-attacks/).

يتم توضيح مثال لهجوم محتمل أدناه.

1. استخدام `tx.origin` لتحديد من سيتم تحويل رموزه، على سبيل المثال:

```
function transfer(address _to, uint _value) {
  tokens[tx.origin] -= _value;
  tokens[_to] += _value;
}
```

2. يقوم المهاجم بجعل الضحية ترسل أموالاً إلى عقد خبيث يستدعي دالة التحويل (transfer) في عقد الرموز، على سبيل المثال:

```
function() payable {
  token.transfer(attackerAddress, 10000);
}
```

3. في هذا السيناريو، سيكون `tx.origin` هو عنوان الضحية (بينما سيكون `msg.sender` هو عنوان العقد الخبيث)، مما يؤدي إلى تحويل الأموال من الضحية إلى المهاجم.