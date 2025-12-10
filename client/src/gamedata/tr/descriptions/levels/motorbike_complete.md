UUPS pattern’ini takip etmenin avantajı, çok minimal bir proxy deploy etmektir. Proxy, sadece bir depolama katmanı olarak işlev görür; yani implementasyon kontratında yapılan state değişiklikleri normalde sistemi kullanan diğer taraflar üzerinde yan etki yaratmaz, çünkü yalnızca delegatecall üzerinden mantık (logic) çalıştırılır.

Bu, implementasyon kontratını initialize etmeden bırakmanın yaratabileceği güvenlik açıklarını göz ardı edeceğimiz anlamına gelmez.

Bu, UUPS pattern’i yayınlandıktan sonra aylar içinde keşfedilen durumların biraz basitleştirilmiş bir versiyonudur.

Çıkarım: implementasyon kontratlarını asla initialize edilmeden bırakma ;) 

Eğer neler olduğunu merak ediyorsan [buradan](https://forum.openzeppelin.com/t/uupsupgradeable-vulnerability-post-mortem/15680) daha fazlasını okuyabilirsin.