Bir dahaki sefere, o arkadaşlar bir kontrata para yatırmadan önce mutlaka bir denetim talep edecekler. Tebrikler!

Proxy kontratları kullanmak, yükseltilebilirlik özellikleri kazandırmak ve dağıtım sırasında gaz maliyetini düşürmek için sıkça tavsiye edilir. Ancak, geliştiricilerin depolama çakışmalarına yol açmamaya dikkat etmesi gerekir, bu seviye de bunu gözler önüne seriyor.

Ayrıca, ETH tüketen işlemler üzerinde iterasyon yapmak, doğru şekilde yönetilmezse sorunlara yol açabilir. ETH harcansa bile `msg.value` değeri aynı kalır, bu yüzden geliştirici her iterasyonda kalan gerçek miktarı manuel olarak takip etmelidir. Bu durum, birden çok `delegatecall` içeren çoklu çağrı (multi-call) deseninde de sorun yaratabilir; kendi başına güvenli görünen bir fonksiyona yapılan birden fazla `delegatecall`, istem dışı ETH transferlerine yol açabilir çünkü `delegatecall` gönderilen orijinal `msg.value` değerini korur.

Hazır olduğunda bir sonraki seviyeye geçebilirsin!
