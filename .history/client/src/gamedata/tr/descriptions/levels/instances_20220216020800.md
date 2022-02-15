Bu seviye, oyunun nasıl oynanacağına dair temel bilgilerde size yol gösterir.

&nbsp;
#### 1. Metamask'ı kurun
Henüz sahip değilseniz, [MetaMask](https://metamask.io/) tarayıcı uzantısını yükleyin (masaüstü makinenizde Chrome, Firefox, Brave veya Opera'da). Uzantının cüzdanını kurun ve uzantının arayüzünün sol üst köşesindeki 'Rinkeby test ağı'na işaret etmek için ağ seçiciyi kullanın.


&nbsp;
#### 2. Tarayıcı konsolunu açın
Tarayıcınızın konsolunu açın: `Araçlar > Geliştirici Araçları`.

Oyundan birkaç mesaj görmelisiniz. Bunlardan biri oyuncunuzun adresini belirtmelidir. Bu oyun sırasında önemli olacak! Aşağıdaki komutu girerek oyuncu adresinizi her zaman görebilirsiniz:
```
player
```

Oyun sırasında önemli bilgiler sağlayabileceğinden, uyarılara ve hatalara dikkat edin.

&nbsp;
#### 3. Konsol yardımcılarını kullanın

Şunu yazarak da mevcut eter bakiyenizi görebilirsiniz:
```
getBalance(player)
```
###### NOTE: "Beklemede (pending)" olarak okunsa bile gerçek değeri görmek için sözünüzü genişletin. Chrome v62 kullanıyorsanız, daha temiz bir konsol deneyimi için `await getBalance(player)` kullanabilirsiniz.


Harika! Konsol tipinde başka hangi yardımcı program işlevlerine sahip olduğunuzu görmek için:
```
help()
```
Bunlar oyun sırasında çok kullanışlı olacak.

&nbsp;
#### 4. Ethernaut sözleşmesi
Konsolda aşağıdaki komutu girin:
```
ethernaut
```
Bu, oyunun ana akıllı sözleşmesidir. Onunla doğrudan konsol üzerinden etkileşim kurmanıza gerek yok (çünkü bu uygulama bunu sizin için yapacak), ancak isterseniz yapabilirsiniz. Şimdi bu nesneyle oynamak, oyunun diğer akıllı sözleşmeleriyle nasıl etkileşime geçileceğini öğrenmenin harika bir yoludur.

Devam edin ve içerde ne olduğunu görmek için ethernaut nesnesini genişletin.

&nbsp;
#### 5. ABI ile etkileşim kurun
`ethernaut`, blok zincirine dağıtılan `Ethernaut.sol` sözleşmesini saran bir `TruffleContract` nesnesidir.
 
Diğer şeylerin yanı sıra, sözleşmenin ABI'si, `Ethernaut.sol`'ün  `owner` gibi tüm genel yöntemlerini ortaya çıkarır. Örneğin aşağıdaki komutu yazın:
```
ethernaut.owner()
```
###### Chrome v62 kullanıyorsanız `await ethernaut.owner() kullanın`.
Ethernaut sözleşmesinin sahibinin kim olduğunu görebilirsiniz, ki bu elbette siz değilsiniz =D.

&nbsp;
#### 6.Test etherleri alın
Oyunu oynamak için test eterine ihtiyacınız olacak. Testnet etheri almanın en kolay yolu [bu](https://faucet.rinkeby.io/), [bu](https://faucets.chain.link/rinkeby) or [bu](https://faucet.paradigm.xyz/) faucet den geçer.

Bakiyenizde bir miktar eter gördüğünüzde, bir sonraki adıma geçin.


&nbsp;
#### 7. Durum seviyesi alma
Bir seviye oynarken, doğrudan ethernaut sözleşmesiyle etkileşime girmezsiniz. Bunun yerine, sizin için bir **durum seviyesi** oluşturmasını istersiniz. Bunu yapmak için sayfanın altındaki mavi düğmeye tıklayın. Git şimdi yap ve geri dön!

MetaMask tarafından işlemi yetkilendirmeniz istenmelidir. Bunu yapın ve konsolda bazı mesajlar görmelisiniz. Bunun blok zincirinde yeni bir sözleşme dağıttığını ve birkaç saniye sürebileceğini unutmayın, bu nedenle lütfen yeni seviye durumları talep ederken sabırlı olun!


&nbsp;
#### 8. Sözleşmenin incelenmesi
Tıpkı ethernaut sözleşmesinde yaptığınız gibi, bu sözleşmenin ABI'sini `sözleşme (contract)` değişkenini kullanarak konsol üzerinden inceleyebilirsiniz.


&nbsp;
#### 9. Seviyeyi tamamlamak için sözleşmeyle etkileşime geçin
Seviyenin detayına yöntemine bakın
```
contract.info()
```
###### Chrome v62 kullanıyorsanız `await contract.info()` komutunu kullanın.
Sözleşmedeki seviyeyi tamamlamak için ihtiyacınız olan her şeye sahip olmalısınız. Seviyeyi tamamladığınızı bildiğinizde, sayfanın altındaki turuncu düğmeyi kullanarak sözleşmeyi gönderin. Bu, örneğinizi tamamlayıp tamamlamadığınızı belirleyecek olan ethernaut'a geri gönderir.

##### İpucu: Her zaman sözleşmenin ABI'sine bakabileceğinizi unutmayın!
