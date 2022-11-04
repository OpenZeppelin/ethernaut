# Ethernaut
 
[![Twitter Follow](https://img.shields.io/twitter/follow/OpenZeppelin?style=plastic&logo=twitter)](https://twitter.com/OpenZeppelin)
[![OpenZeppelin Forum](https://img.shields.io/badge/Ethernaut%20Forum%20-discuss-blue?style=plastic&logo=discourse)](https://forum.openzeppelin.com/tag/ethernaut)

Ethernaut [overthewire](https://overthewire.org)'dan etkilenerek yaratılmış Ethereum Sanal Makinesinde (EVM) oynanabilecek bir Web3/Solidity oyunudur. Her seviye saldırıya uğraması gereken bir akıllı kontrattır.

Oyun, hem Ethereum'u öğrenmek isteyenler için bir araç olarak hem de tarihsel gelişimleri seviye olarak kataloglamanın bir yolu olarak hareket etmektedir. Oyunda sonsuz sayıda seviye olabilir ve belirli bir sıra ile oynanması gerekmez.

## Yayınlanmış Sürümler

[ethernaut.openzeppelin.com](https://ethernaut.openzeppelin.com) adresinden mevcut resmî sürüme erişim sağlayabilirsiniz.

## Yükleme ve Build Etme

Ethernaut ile local olarak çalışabilmeniz için üç bileşen mevcuttur:

- Test Ağı - Genache, HardHat Network, Geth gibi local olarak çalışan bir test ağıdır
- Kontrat Yayınlama - Kontratlar ile çalışmak için local üzerinde testnet aracılığı ile yayınlanmış olması gerekmektedir.
- İstemci/Önyüz - localhost:3000 üzerinden erişim sağlanabilen bir React uygulaması

Aşağıdaki adımları izleyerek yükleme, build alma ve Ethernaut'u local üzerinde çalıştırabilirsiniz:

1. Repo klonlama ve gereklilikleri yükleme:

    ```bash
    git clone git@github.com:OpenZeppelin/ethernaut.git
    yarn install
    ```
2. RPC çalıştırma:

    ```bash
    yarn network
    ```
3. genache-cli kullanarak Metamask'a bir adet özel anahtar ekleme

4. Kontratları derleme

    ```bash
    yarn compile:contracts
    ```
5. ACTIVE_NETWORK 'ü NETWORKS.LOCAL olarak client/src/constants.js içerisinden değiştirme
6. Kontratları yayınlama

    ```bash
    yarn deploy:contracts
    ```

7. Local'de Ethernaut'u çalıştırma

    ```bash
    yarn start:ethernaut
    ```

### Local çalıştırma (ropsten network)

Aynı şekilde local network üzerinde çalıştırır gibi, fakat 2, 3 ve 6. adımlar gereksiz.

Beşinci adımda aşağıdakini uygulayın:

5. ACTIVE_NETWORK 'ü NETWORKS.ROPSTEN olarak client/src/constants.js içerisinden değiştirme

### Test çalıştırma

```bash
yarn test:contracts
```

### Build etme

```bash
yarn build:ethernaut
```

### Yayınlama

ROPSTEN üzerinde kontrat yayınlamak için öncelikle constants.js içerisinden ACTIVE_NETWORK değişikliği sağlayın ve gamedata.json dosyasını düzenleyin. Bu dosya her seviye verisinin datalarını deployed_ropsten dizisi içerisinde tutar. Yeni bir aşama yayınlamak için diziye "x" ekleyin. Örnek:


```json
"deployed_ropsten": [
  "x",
  "0x4b1d5eb6cd2849c7890bcacd63a6855d1c0e79d5",
  "0xdf51a9e8ce57e7787e4a27dd19880fd7106b9a5c"
],
```
Sonrasında `yarn deploy:contracts` komutunu çalıştırın. Bu eylem deployed_ropsten dizisi güncellenmiş olan veriyi etkin bir şekilde yayınlayacaktır. Ayrıca Ethernaut dApp'ini yeni seviyeler için bu kontratı kullanmaya yöneltecektir.

## Katkı

Katkı ve düzeltmelerinizi bekliyoruz.

Bu konuda yardımcı olabilmek için lütfen [Katkı Adımları](./CONTRIBUTING.md) adresini ziyaret ediniz.
