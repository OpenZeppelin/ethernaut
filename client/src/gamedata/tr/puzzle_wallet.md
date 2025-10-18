Günümüzde DeFi işlemleri için ödeme yapmak neredeyse imkânsız hâl aldı.

Bir grup arkadaş, birden fazla işlemi tek bir işlemde batchleyerek maliyeti biraz düşürmenin yolunu buldu ve bunu yapan bir akıllı kontrat geliştirdiler.

Bu kontratın kodunda hata olması durumunda güncellenebilir olmasını istediler ve ayrıca grubun dışındakilerin kullanmasını engellemek istediler. Bu nedenle oylama yaptılar ve sisteme iki özel rol atadılar:
Admin, akıllı kontratın mantığını (logic) güncelleme yetkisine sahip.
Owner, Kontratı kullanmaya izin verilen adreslerin whitelist’ini kontrol ediyor.
Kontratlar dağıtıldı ve grup whitelist’e eklendi. Herkes madencilere karşı zaferlerini kutladı.

Fakat bilmedikleri şey, öğle yemeği paraları tehlikedeydi...

&nbsp;
Bu cüzdanı ele geçirip proxy’nin admini olmalısın.

&nbsp;
Yardımcı olabilecek noktalar:
* `delegatecall`'ın nasıl çalıştığını ve bir `delegatecall` sırasında `msg.sender` ile `msg.value`'ın nasıl davrandığını anla.
* Proxy pattern’leri ve bunların storage (depolama) değişkenlerini nasıl yönettiğini öğren.
