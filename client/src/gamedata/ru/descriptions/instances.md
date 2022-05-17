Этот уровень поможет тебе освоить основы игры.

#### 1. Установи MetaMask

Установи расширение для браузера [MetaMask](https://metamask.io/) в Chrome, Firefox, Brave или Opera на компьютере. Выполни шаги, чтобы сгенерировать и настроить 'кошелек' и смени текущую сеть на тестовую сеть Rinkeby с помощью выпадающего меню в верхней части интерфейса MetaMask.

#### 2. Открой консоль браузера

Открой консоль браузера с помощью `Tools > Browser Tools > Browser Console` в Firefox или `View > Developer > Developer > JavaScript Console` в Chrome.

В консоли должно появиться несколько игровых сообщений, в том числе твой адрес. Этот адрес очень важен! Ты можешь посмотреть свой адрес позже с помощью команды: 

`player`

Следи за предупреждениями и ошибками, они сообщают важную информацию по ходу игры.

#### 3. Используй вспомогательные функции

Ты можешь узнать свой текущий баланс с помощью команды:

`getBalance(player)`

###### ПРИМЕЧАНИЕ: используй `await getBalance(player)` чтобы отобразить возвращаемое значение.

Отлично! Полный список вспомогательных функций можно получить с помощью команды:

`help()`

Это поможет тебе по ходу игры.

#### 4. Контракт Ethernaut

Enter the following command in the console:

`ethernaut`

This is the game's main smart contract. You don't need to interact with it directly through the console (as this app will do that for you) but you can if you want to. Playing around with this object now is a great way to learn how to interact with the other smart contracts of the game.

Go ahead and expand the ethernaut object to see what's inside.

#### 5. Interact with the ABI
`ethernaut` is a `TruffleContract` object that wraps the `Ethernaut.sol` contract that has been deployed to the blockchain.

Among other things, the contract's ABI exposes all of `Ethernaut.sol`'s public methods, such as `owner`. Type the following command for example:

`ethernaut.owner()` or `await ethernaut.owner()` if you're using Chrome v62.

You can see who the owner of the ethernaut contract is.

#### 6. Get test ether
To play the game, you will need test ether. The easiest way to get some testnet ether is via [this](https://faucet.rinkeby.io/), [this](https://faucets.chain.link/rinkeby) or [this faucet](https://faucet.paradigm.xyz/). Those are Rinkeby faucets where the game was originally deployed. If you're on a different network be sure to find your test money needed to run the game.

Once you see some ether in your balance, move on to the next step.

#### 7. Getting a level instance
When playing a level, you don't interact directly with the ethernaut contract. Instead, you ask it to generate a **level instance** for you. To do so, click the blue button at the bottom of the page. Go do it now and come back!

You should be prompted by MetaMask to authorize the transaction. Do so, and you should see some messages in the console. Note that this is deploying a new contract in the blockchain and might take a few seconds, so please be patient when requesting new level instances!

#### 8. Inspecting the contract
Just as you did with the ethernaut contract, you can inspect this contract's ABI through the console using the `contract` variable.

#### 9. Interact with the contract to complete the level
Look into the level's info method `contract.info()` or `await contract.info()` if you're using Chrome v62.
You should have all you need to complete the level within the contract.
When you know you have completed the level, submit the contract using the submit button at the bottom of the page.
This sends your instance back to the ethernaut, which will determine if you have completed it.


##### Tip: don't forget that you can always look in the contract's ABI!
