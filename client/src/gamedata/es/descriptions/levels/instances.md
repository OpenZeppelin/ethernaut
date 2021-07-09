This level walks you through the very basics of how to play the game.

&nbsp;
#### 1. Set up MetaMask
If you don't have it already, install the [MetaMask browser extension](https://metamask.io/) (in Chrome, Firefox, Brave or Opera on your desktop machine).
Set up the extension's wallet and use the network selector to point to the 'Rinkeby test network' in the top left of the extension's interface.

&nbsp;
#### 2. Open the browser's console
Open your browser's console: `Tools > Developer Tools`.

You should see a few messages from the game. One of them should state your player's address. This will be important during the game! You can always see your player address by entering the following command:
```
player
```

Keep an eye out for warnings and errors, since they could provide important information during gameplay.

&nbsp;
#### 3. Use the console helpers

You can also see your current ether balance by typing:
```
getBalance(player)
```
###### NOTE: Expand the promise to see the actual value, even if it reads "pending". If you're using Chrome v62, you can use `await getBalance(player)` for a cleaner console experience.

Great! To see what other utility functions you have in the console type:
```
help()
```
These will be super handy during gameplay.

&nbsp;
#### 4. The ethernaut contract
Enter the following command in the console:
```
ethernaut
```

This is the game's main smart contract. You don't need to interact with it directly through the console (as this app will do that for you) but you can if you want to. Playing around with this object now is a great way to learn how to interact with the other smart contracts of the game.

Go ahead and expand the ethernaut object to see what's inside.

&nbsp;
#### 5. Interact with the ABI
`ethernaut` is a `TruffleContract` object that wraps the `Ethernaut.sol` contract that has been deployed to the blockchain.

Among other things, the contract's ABI exposes all of `Ethernaut.sol`'s public methods, such as `owner`. Type the following command for example:
```
ethernaut.owner()
```
###### `await ethernaut.owner()` if you're using Chrome v62.
You can see who the owner of the ethernaut contract is, which is not you of course =D.

&nbsp;
#### 6. Get test ether
To play the game, you will need test ether. The easiest way to get some testnet ether is via [this faucet](https://faucet.rinkeby.io/).

Once you see some ether in your balance, move on to the next step.

&nbsp;
#### 7. Getting a level instance
When playing a level, you don't interact directly with the ethernaut contract. Instead, you ask it to generate a **level instance** for you. To do so, click the blue button at the bottom of the page. Go do it now and come back!

You should be prompted by MetaMask to authorize the transaction. Do so, and you should see some messages in the console. Note that this is deploying a new contract in the blockchain and might take a few seconds, so please be patient when requesting new level instances!

&nbsp;
#### 8. Inspecting the contract
Just as you did with the ethernaut contract, you can inspect this contract's ABI through the console using the `contract` variable.

&nbsp;
#### 9. Interact with the contract to complete the level
Look into the levels's info method
```
contract.info()
```
###### `await contract.info()` if you're using Chrome v62.
You should have all you need to complete the level within the contract.
When you know you have completed the level, submit the contract using the orange button at the bottom of the page.
This sends your instance back to the ethernaut, which will determine if you have completed it.


##### Tip: don't forget that you can always look in the contract's ABI!
