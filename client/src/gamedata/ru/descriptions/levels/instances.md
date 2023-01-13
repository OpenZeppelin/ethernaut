Этот уровень поможет тебе освоить основы игры.

#### 1. Set up MetaMask

If you don't have it already, install the [MetaMask browser extension](https://metamask.io/) (in Chrome, Firefox, Brave or Opera on your desktop machine).
Set up the extension's wallet and use the network selector to point to the preferred network in the top left of the extension's interface. Alternatively you can use the UI button to switch between networks. If you select an unsupported network, the game will notify you and bring you to the default Goerli testnet.

#### 2. Открой консоль браузера

Открой консоль браузера с помощью `Tools > Browser Tools > Browser Console` в Firefox или `View > Developer > Developer > JavaScript Console` в Chrome.

В консоли должно появиться несколько новых сообщений, в том числе твой адрес. Этот адрес пригодится по ходу игры! Ты можешь посмотреть его позже с помощью команды: 

`player`

Следи за предупреждениями и ошибками в консоли, они сообщают важную информацию об игре.

#### 3. Вспомогательные функции

Ты можешь узнать свой текущий баланс с помощью команды:

`getBalance(player)`

##### Примечание: используй `await getBalance(player)` чтобы сразу отобразить результат.

Полный список вспомогательных функций можно получить с помощью команды:

`help()`

Это поможет тебе по ходу игры.

#### 4. Контракт Ethernaut

Получить объект контракта Ethernaut можно с помощью команды:

`ethernaut`

Большую часть времени ты будешь взаимодействовать с контрактом Ethernaut через веб-интерфейс, но у тебя всегда есть возможность взаимодействовать с ним через консоль браузера.

Аналогичным образом можно взаимодействовать с другими контрактами в игре, в частности с инстансами, поэтому сейчас удачная возможность потренироваться в этом.

Раскрой объект `ethernaut` в консоли, чтобы посмотреть какие объекты и функции он содержит.

#### 5. Interact with the ABI

`ethernaut` is a `TruffleContract` object that wraps the `Ethernaut.sol` contract that has been deployed to the blockchain.

Among other things, the contract's ABI exposes all of `Ethernaut.sol`'s public methods, such as `owner`. Type the following command for example:

`ethernaut.owner()` or `await ethernaut.owner()` if you're using Chrome v62.

You can see who the owner of the ethernaut contract is.

#### 6. Получи тестовый эфир

To play the game, you will need test ether. The easiest way to get some testnet ether is via a valid faucet for your chosen network.

Once you see some coins in your balance, move on to the next step.

#### 7. Получи инстанс

Для прохождения игры тебе не придется взаимодействовать с контрактом `ethernaut` напрямую, вместо этого ты будешь запрашиваешь создание **инстанса уровня** и взаимодействовать с созданным инстансом.

Чтобы запросить инстанс нажми на соответствующую кнопку внизу этой страницы и подтверди транзакцию в MetaMask. После этого в консоли должно появиться несколько новых сообщений.

##### Примечание: создание инстанса займет некоторое время, потому что необходимо раскатить контракт инстанса в блокчейн.

Создай инстанс и переходи к следующему пункту!

#### 8. Взаимодействие с инстансом

Чтобы взаимодействовать с инстансом через консоль браузера используй команду:

`contract`

Взаимодействие с инстансом аналогично взаимодействию с контрактом `ethernaut`.

#### 9. Взаимодействуй с контрактом, чтобы завершить уровень

Выполни команду:

`contract.info()`

или

`await contract.info()`

Теперь у тебя есть вся информация необходимая для завершения уровня.

##### Подсказка: не забудь, что ты можешь посмотреть ABI контракта!

Когда ты уверен(а), что завершил(а) уровень - отправь его на проверку с помощью соответствующей кнопки внизу страницы.
