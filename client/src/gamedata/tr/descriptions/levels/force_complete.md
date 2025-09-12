Solidity'de bir kontratın ödeme alabilmesi için fallback fonksiyonunun `payable` olması gerekir.

Ama bir saldırganın self destroying ile kontrata Ether göndermesini engellemenin bir yolu yoktur. Bu yüzden hiçbir kontrat mantığında `address(this).balance == 0` gibi bir önermeye (invariant) güvenmemek çok önemlidir.