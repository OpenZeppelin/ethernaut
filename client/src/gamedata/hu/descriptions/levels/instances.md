Ez a szint végigvezet a játék alapjain.

&nbsp;
#### 1. MetaMask beállítása
Ha még nincs meg, telepítsd a [MetaMask böngésző bővítményt](https://metamask.io/) (Chrome-ban, Firefox-ban, Brave-ben vagy Opera-ban asztali gépeden).
Állítsd be a bővítmény tárcáját és használd a hálózat választót, hogy a preferált hálózatra mutathasson a bővítmény felületének bal felső sarkában. Alternatívaként használhatod a UI gombot a hálózatok közötti váltáshoz. Ha nem támogatott hálózatot választasz, a játék értesít és elvisz az alapértelmezett Sepolia testnet-re.

#### 2. Nyisd meg a böngésző konzolját
Nyisd meg a böngésző konzolját: `Eszközök > Fejlesztői eszközök`.

Látnod kell néhány üzenetet a játéktól. Az egyiknek ki kellene írnia a játékos címedet. Ez fontos lesz a játék során! Mindig megnézheted a játékos címedet a következő paranccsal: 

`player`

Figyelj az figyelmeztetésekre és hibákra, mert fontos információkat nyújthatnak a játékmenet során.

#### 3. Használd a konzol segédprogramokat

Az aktuális ether egyenlegedet is megnézheted beírva:

`getBalance(player)`

###### MEGJEGYZÉS: Bontsd ki a promise-t, hogy lásd a valódi értéket, még ha "pending"-et ír is. Ha Chrome v62-t használsz, használhatod az `await getBalance(player)` parancsot tisztább konzol élményért.

Nagyszerű! Hogy lásd, milyen más hasznos függvényeid vannak a konzolon, írd be:

`help()`

Ezek szuper hasznosak lesznek a játékmenet során.

#### 4. Az ethernaut szerződés
Add meg a következő parancsot a konzolon:

`ethernaut`

Ez a játék fő okosszerződése. Nem kell közvetlenül interakcióba lépned vele a konzolon keresztül (mivel ezt az alkalmazás megteszi helyetted), de megteheted, ha szeretnéd. Az objektummal való játszadozás most nagyszerű módja annak, hogy megtanuld, hogyan lépj interakcióba a játék többi okosszerződésével.

Bontsd ki az ethernaut objektumot, hogy lásd, mi van benne.

#### 5. Interakció az ABI-val
Az `ethernaut` egy `TruffleContract` objektum, amely becsomagolja az `Ethernaut.sol` szerződést, amelyet telepítettek a blokkláncra.

Többek között a szerződés ABI-ja elérhetővé teszi az `Ethernaut.sol` összes publikus metódusát, mint például az `owner`. Írd be például a következő parancsot:

`ethernaut.owner()` vagy `await ethernaut.owner()` ha Chrome v62-t használsz.

Láthatod, ki az ethernaut szerződés tulajdonosa.

#### 6. Szerezz teszt ethert
A játék játszásához teszt etherre lesz szükséged. A legegyszerűbb módja a testnet ether megszerzésének egy érvényes faucet a választott hálózatodhoz.

Amint látsz néhány érmét az egyenlegedben, lépj tovább a következő lépésre.

#### 7. Szint példány megszerzése
Amikor egy szintet játszol, nem közvetlenül az ethernaut szerződéssel lépsz interakcióba. Ehelyett megkéred, hogy generáljon egy **szint példányt** neked. Ehhez kattints a "Új példány kérése" gombra az oldal alján. Tedd meg most és gyere vissza!

A MetaMask-nak kérnie kell, hogy engedélyezd a tranzakciót. Tedd meg, és látnod kell néhány üzenetet a konzolon. Vedd figyelembe, hogy ez egy új szerződést telepít a blokkláncra, és eltarthat néhány másodpercig, szóval légy türelmes, amikor új szint példányokat kérsz!

#### 8. A szerződés vizsgálata
Ahogy az ethernaut szerződéssel tetted, megvizsgálhatod ennek a szerződésnek az ABI-ját a konzolon keresztül a `contract` változóval.

#### 9. Lépj interakcióba a szerződéssel a szint befejezéséhez
Nézd meg a szint info metódusát: `contract.info()` vagy `await contract.info()` ha Chrome v62-t használsz.
Minden szükséges információval rendelkezel a szint befejezéséhez a szerződésen belül.
Amikor tudod, hogy befejezted a szintet, küldd be a szerződést a beküldés gombbal az oldal alján.
Ez visszaküldi a példányodat az ethernaut-nak, amely meghatározza, hogy befejezted-e.


##### Tipp: ne felejtsd el, hogy mindig megnézheted a szerződés ABI-ját!
