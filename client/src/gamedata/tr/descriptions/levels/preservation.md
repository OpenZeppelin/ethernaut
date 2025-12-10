Bu kontrat, iki farklı zaman dilimi için iki ayrı zamanı saklamak üzere bir kütüphane kullanıyor. Kurucu fonksiyon (constructor), saklanacak her zaman için kütüphaneden iki örnek (instance) oluşturuyor.

Bu seviyedeki amacın, sana verilen örneğin sahipliğini ele geçirmek.

&nbsp; Yardımcı olabilecek noktalar
* `delegatecall` düşük seviyeli fonksiyonunu ve nasıl çalıştığını incele: zincir üzerindeki kütüphanelere işlemleri devretmek için nasıl kullanılır ve yürütme bağlamı (execution scope) üzerinde ne gibi etkileri olur.
* `delegatecall`'ın bağlamı koruyan (context-preserving) olduğunu anlamak; yani çağrılan kodun çağıranın depolama (storage) alanı üzerinde çalıştığını unutma. 
* Depolama değişkenlerinin (storage variables) nasıl saklandığını ve nasıl erişildiğini iyi anla.
* Farklı veri tipleri arasındaki tür dönüşümlerinin (casting) nasıl çalıştığını öğren.
