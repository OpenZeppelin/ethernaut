Ez a kapuőr néhány új kihívást vezet be. Regisztrálj belépőként a szint teljesítéséhez.

##### Dolgok, amelyek segíthetnek:
* Emlékezz arra, amit tanultál az első kapuőr megkerüléséből - az első kapu ugyanaz.
* Az `assembly` kulcsszó a második kapuban lehetővé teszi egy szerződésnek, hogy hozzáférjen olyan funkcionalitáshoz, amely nem natív a vanilla Solidity-ben. Lásd [Solidity Assembly](http://solidity.readthedocs.io/en/v0.4.23/assembly.html) további információkért. Az `extcodesize` hívás ebben a kapuban megkapja egy szerződés kódjának méretét egy adott címen - többet tanulhatsz arról, hogyan és mikor van ez beállítva a [yellow paper](https://ethereum.github.io/yellowpaper/paper.pdf) 7. szakaszában.
* A `^` karakter a harmadik kapuban egy bitwise művelet (XOR), és itt használják egy másik gyakori bitwise művelet alkalmazására (lásd [Solidity cheatsheet](http://solidity.readthedocs.io/en/v0.4.23/miscellaneous.html#cheatsheet)). A Coin Flip szint szintén jó kiindulópont ennek a kihívásnak a megközelítésekor.
