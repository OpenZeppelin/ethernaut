Tebrikler!

Bu, bir [Forta bot](https://docs.forta.network/en/latest/) ile ilk deneyimin. 

Forta, bağımsız node operatörlerinden oluşan merkeziyetsiz bir ağdır ve tüm işlemleri ile blok blok durum değişikliklerini olağan dışı işlemler ve tehditler açısından tarar. Bir sorun tespit edildiğinde, node operatörleri potansiyel riskler hakkında abonelere uyarılar gönderir; bu sayede kullanıcılar gerekli aksiyonları alabilir.

Buradaki örnek yalnızca eğitim amaçlıdır çünkü Forta botları henüz akıllı kontratlara entegre edilmemiştir. Forta’da bir bot, belirli koşulları veya olayları tespit eden bir kod scriptidir; uyarı yayımlandığında otomatik bir işlem tetiklemez - en azından şimdilik. Bu seviyede botun uyarısı, Forta'nın amaçlanan bot tasarımından farklı olarak, işlemde etkili bir şekilde geri dönüşü (revert) tetikler.

Detection botları, kontratların son implementasyonlarına çok bağlıdır ve bazıları yükseltilebilir olduğundan bot entegrasyonlarını bozabilir ama bunu önlemek için kontrat yükseltmelerini takip eden ve bu durumlara tepki veren özel bir bot oluşturmak da mümkündür. Nasıl yapılacağını [buradan](https://docs.forta.network/en/latest/quickstart/) öğrenebilirsin.

Ayrıca, OpenZeppelin’in [Compound protokolü ile yaptığı son işbirliği](https://compound.finance/governance/proposals/76) sırasında ortaya çıkan güncel bir güvenlik sorununu da geçtiğinizi belirtelim. 

Double entry point özelliğine sahip token’lar, birçok protokolü etkileyebilecek karmaşık bir yapıdır. Çünkü genellikle her token için yalnızca bir kontrat olduğu varsayılır. Ama bu sefer durum farklıydı :) Neler olduğuna tüm detaylarıyla [buradan](https://blog.openzeppelin.com/compound-tusd-integration-issue-retrospective/) ulaşabilirsin.
