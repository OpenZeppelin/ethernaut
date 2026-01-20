Véletlen számok generálása Solidity-ben trükkös lehet. Jelenleg nincs natív módja a generálásuknak, és minden, amit az okosszerződésekben használsz, nyilvánosan látható, beleértve a lokális változókat és az privátként megjelölt állapotváltozókat is. A bányászok szintén kontrollálják az olyan dolgokat, mint a blokkhashe-k, időbélyegek és azt, hogy bizonyos tranzakciókat belevennek-e - ami lehetővé teszi számukra, hogy ezeket az értékeket a javukra hajlítsák.

Kriptográfiailag bizonyított véletlen számok beszerzéséhez használhatod a [Chainlink VRF](https://docs.chain.link/docs/get-a-random-number)-et, amely egy orákulum-ot, a LINK tokent és egy on-chain szerződést használ annak ellenőrzésére, hogy a szám valóban véletlen.

Néhány egyéb lehetőség közé tartozik a Bitcoin blokk fejlécek használata ([BTC Relay](http://btcrelay.org)-n keresztül ellenőrizve), [RANDAO](https://github.com/randao/randao), vagy [Oraclize](http://www.oraclize.it/)).

