Bu seviye, özel bir işlevi olan bir `CryptoVault` kontratını içeriyor, `sweepToken` fonksiyonu. Bu, kontratta sıkışan token’ları almak için yaygın olarak kullanılan bir fonksiyondur. `CryptoVault` silinemeyecek (sweeping yapılamayacak) bir `underlying` token ile çalışır; çünkü bu token `CryptoVault`'un temel mantığının önemli bir parçasıdır. Diğer tüm token’lar ise alınabilir (sweep yapılabilir).

Underlying token, `DoubleEntryPoint` kontratında tanımlı DET token örneğidir ve `CryptoVault` içinde 100 birim bulunur. Buna ek olarak, `CryptoVault` içinde 100 birim `LegacyToken LGT` da vardır.

Bu seviyede, `CryptoVault`’daki hatayı bulmalı ve token’ların çekilmesini engelleyecek bir çözüm geliştirmelisin.

Kontrat ayrıca bir `Forta` kontratına sahiptir; buraya herhangi bir kullanıcı kendi `detection bot` kontratını kaydedebilir. Forta; DeFi, NFT, governance, köprüler ve diğer Web3 sistemlerindeki tehditleri ve anormallikleri olabildiğince hızlı tespit etmek için merkeziyetsiz ve topluluk tabanlı bir izleme ağıdır. Senin görevin bir `detection bot` uygulamak ve bunu `Forta` kontratına kaydetmektir. Bot, potansiyel saldırıları veya hata istismarlarını önlemek için doğru uyarıları oluşturacak şekilde çalışmalıdır.

Yardımcı olabilecek noktalar:
- Bir token kontratı için double entry point nasıl çalışır?
