Bu seviye, akıllı kontratlarında zamana dayalı erişim kontrolü için `block.timestamp` kullanmanın güvenlik açığını gösterir.

Çözüm, madencilerin blok zaman damgaları üzerinde bir miktar kontrole sahip olduğunu anlamayı içerir. Keyfi zaman damgaları belirleyemeseler de, bunları belirli sınırlar içinde (genellikle gerçek zamandan ±15 saniye) manipüle edebilirler.

Foundry veya Hardhat gibi test ortamlarında, zaman manipülasyon fonksiyonlarını (`vm.warp()` veya `evm_increaseTime()`) kullanarak zamanı hızlandırabilir ve zaman kilidini anında atlayabilirsiniz.

Güvenli zaman kilidi uygulamaları için şunları düşünün:
- Daha öngörülebilir zamanlama için zaman damgaları yerine blok numaralarını kullanma
- Zaman kısıtlamalarının yanı sıra ek erişim kontrolleri uygulama
- OpenZeppelin'in TimelockController'ı gibi yerleşik zaman kilidi desenlerini kullanma
- "Özel" değişkenler dahil olmak üzere blockchain'deki tüm verilerin herkese açık olduğunu fark etme

Zaman damgası bağımlılığı güvenlik açıkları hakkında daha fazla bilgi için [Consensys Akıllı Kontrat En İyi Uygulamaları](https://consensys.github.io/smart-contract-best-practices/development-recommendations/general/timestamp-dependence/)'na bakın.