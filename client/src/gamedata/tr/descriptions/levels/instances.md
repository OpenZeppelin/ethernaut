Bu seviye, oyunun nasıl oynanacağına dair temel bilgileri size öğretecek.

&nbsp;
#### 1. MetaMask’i Kurun
Eğer hâlâ yüklemediyseniz, masaüstü tarayıcınızda (Chrome, Firefox, Brave veya Opera) [MetaMask eklentisini](https://metamask.io/) indirin ve kurun.
Eklentinin cüzdanını oluşturun ve sol üstteki ağ seçicisinden istediğiniz ağa geçiş yapın. Alternatif olarak arayüzdeki butonu kullanarak ağlar arasında geçiş yapabilirsiniz. Eğer desteklenmeyen bir ağ seçerseniz, oyun size bildirim verecek ve varsayılan Sepolia test ağına yönlendirecektir.

#### 2. Tarayıcı konsolunu açın
Tarayıcınızın konsolunu açın: `Araçlar (Tools) > Geliştirici Araçları (Developer Tools)`.

Konsolda oyundan gelen birkaç mesaj göreceksiniz. Bunlardan biri oyuncu adresinizi gösterecek. Bu adres oyun boyunca çok önemli olacak! Oyuncu adresinizi her zaman şu komutu girerek görebilirsiniz:

`player`

Uyarılara ve hatalara dikkat edin; çünkü bunlar oyun sırasında size önemli bilgiler verebilir.

#### 3. Konsol yardımcılarını kullanın

Mevcut ether bakiyenizi görmek için şunu yazabilirsiniz:

`getBalance(player)`

###### NOT: Konsolda “pending” yazsa bile değeri görmek için promise’i genişletmeniz gerekir. Chrome v62 kullanıyorsanız, daha temiz bir konsol deneyimi için `await getBalance(player)` yazabilirsiniz.

Harika! Konsolda başka hangi yardımcı fonksiyonların olduğunu görmek için şunu yazın:

`help()`

Bunlar oyun sırasında çok işinize yarayacak.

#### 4. Ethernaut kontratı
Konsola aşağıdaki komutu girin:

`ethernaut`

Bu, oyunun ana akıllı kontratı. Konsol üzerinden onunla doğrudan etkileşime girmen gerekmez (çünkü bu uygulama senin yerine bunu yapacak) ama istersen sen de deneyebilirsin. Bu nesneyle biraz oynamak, oyundaki diğer akıllı kontratlarla nasıl etkileşime gireceğini öğrenmenin harika bir yoludur.

Hadi, ethernaut nesnesini genişlet ve içinde neler olduğuna bir göz at!

#### 5. ABI ile etkileşim
`ethernaut`, blockchain’e deploy edilmiş `Ethernaut.sol` kontratını saran bir `TruffleContract` nesnesidir.

Bu kontratın ABI’si, `owner` gibi `Ethernaut.sol` içindeki tüm public metotlara erişim sağlar. Örneğin şu komutları yazabilirsiniz:

`ethernaut.owner()` veya Chrome v62 kullanıyorsanız `await ethernaut.owner()`.

Böylece Ethernaut kontratının sahibinin kim olduğunu görebilirsiniz.

#### 6. Test ether al
Oyunu oynayabilmek için test ether'a ihtiyacın olacak. Biraz testnet ether almanın en kolay yolu seçtiğin ağ için geçerli bir faucet kullanmaktır.

Bakiyende birkaç coin gördüğünde bir sonraki adıma geçebilirsin.

#### 7. Seviye örneği alma
Bir seviyeyi oynarken doğrudan ethernaut kontratıyla etkileşime girmezsin. Onun yerine, senden bir **seviye örneği (level instance)** oluşturmasını istersin. Bunu yapmak için sayfanın altındaki “Seviye örneği al” düğmesine tıkla. Hadi şimdi dene ve geri gel!

MetaMask senden işlemi onaylamanı isteyecek. Onayladıktan sonra konsolda bazı mesajlar göreceksin. Bu işlemin aslında blok zincirine yeni bir kontrat deploy ettiğini unutma. Bu yüzden yeni seviye örneği oluştururken birkaç saniye sürebilir — sabırlı ol!

#### 8. Kontratı inceleme
Tıpkı ethernaut kontratında yaptığın gibi, bu kontratın ABI’sini de konsol üzerinden `contract` değişkenini kullanarak inceleyebilirsin.

#### 9. Seviyeyi tamamlamak için kontratla etkileşime gir
Seviyenin info metoduna göz at: `contract.info()` veya Chrome v62 kullanıyorsan `await contract.info()`.
Seviye ile ilgili gerekli tüm bilgiler kontratın içinde olacak.
Seviyeyi tamamladığından emin olduğunda, sayfanın altındaki gönder butonunu kullanarak kontratı gönder. Bu işlem, örneğini tekrar ethernaut kontratına yollar ve seviyeyi tamamlayıp tamamlamadığını kontrol eder.

##### İpucu: Unutma, kontratın ABI’sine her zaman göz atabilirsin!