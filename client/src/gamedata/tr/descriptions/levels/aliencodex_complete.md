Bu seviye, EVM’nin bir dizinin tanımlanan uzunluğunu gerçek verisiyle kontrol etmemesinden faydalanıyor.

Ayrıca dizinin uzunluğunda meydana gelen alt taşma (underflow) sayesinde dizinin sınırlarını `2^256`’lık tüm depolama alanına kadar genişletebiliyorsun. Böylece kontrattaki tüm verileri değiştirebilirsin.

Bu iki güvenlik açığı, 2017’de düzenlenen [Underhanded coding contest](https://medium.com/@weka/announcing-the-winners-of-the-first-underhanded-solidity-coding-contest-282563a87079) etkinliğinden ilham alınarak tasarlandı.
