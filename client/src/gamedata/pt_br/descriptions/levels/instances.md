Este nível mostra os passos para aprender a jogar o jogo.

&nbsp;
#### 1. Configure o MetaMask
Se você ainda não instalou, adicione o [MetaMask browser extension](https://metamask.io/) (no Chrome, Firefox, Brave ou Opera no seu computador).
Configure a carteira da extensão e use o seletor de rede para apontar para a rede preferida no canto superior esquerdo da interface da extensão. Alternativamente, você pode usar o botão para alternar entre as redes. Se você selecionar uma rede não suportada, o jogo irá notificá-lo e levá-lo para a Sepolia Testnet padrão.

#### 2. Abra o console do navegador
Abra o console do seu navegador: `Tools > Developer Tools`.

Você vai ver algumas mensagens do jogo. Uma delas deve indicar o endereço do seu jogador. Isso será importante durante o jogo! Você sempre pode ver o endereço do seu jogador digitando o seguinte comando:

`player`

Preste atenção aos avisos e erros. Eles podem oferecer informações importantes durante o jogo.

#### 3. Use os helpers do console

Você também pode ver o seu saldo atual de ether digitando:

`getBalance(player)`

###### NOTA: Expanda a promise para ver o valor real, mesmo que esteja "pending". Se você está usando o Chrome v62, você pode usar `await getBalance(player)` para uma experiência melhor no console.

Ótimo! Para ver quais outras funções utilitárias você tem no console, digite:

`help()`

Estes comandos serão úteis durante o jogo.

#### 4. O contrato ethernaut
Digite o seguinte comando no console:

`ethernaut`

Este é o principal contrato inteligente do jogo. Você não precisa interagir com ele diretamente pelo console (pois o jogo fará isso por você), mas você pode se quiser. Brincar com este objeto agora é uma ótima maneira de aprender a interagir com os outros contratos inteligentes do jogo.

Vá em frente e expanda o objeto ethernaut para ver o que tem dentro.

#### 5. Interaja com a ABI
`ethernaut` é um objeto `TruffleContract` que envolve o contrato `Ethernaut.sol` que foi implementado na blockchain.

Entre outras coisas, a ABI do contrato expõe todos os métodos públicos do `Ethernaut.sol`, tal como `owner`. Digite o seguinte comando como exemplo:

`ethernaut.owner()` ou `await ethernaut.owner()` se você está usando o Chrome v62.

Você pode ver quem é o dono do contrato ethernaut.

#### 6. Obtenha ether para testes
Para jogar o jogo, você vai precisar de alguns ethers de teste. A maneira mais fácil de obter ether na testnet é atráves de um faucet válido para a rede escolhida.

Depois de obter algum valor no seu saldo, passe para a próxima etapa.

#### 7. Obtendo a instância de um nível
Ao jogar um nível, você não interage diretamente com o contrato ethernaut. Em vez disso, você solicita que ele gere a **instância de um nível** para você. Para fazer isso, clique no botão azul na parte inferior da página. Que tal fazer isso agora e voltar depois?

O MetaMask deve solicitar que você autorize a transação. Faça isso e você verá algumas mensagens no console. Note que isso está fazendo o deploy de um novo contrato na blockchain e pode levar alguns segundos, então por favor seja paciente quando solicitar novas instâncias dos níveis!

#### 8. Inspecionando o contrato
Assim como você fez com o contrato ethernaut, você pode inspecionar a ABI desse contrato através do console usando a variável `contract`.

#### 9. Interaja com o contrato para completar o nível
Examine o método de informação do nível usando `contract.info()` ou `await contract.info()` se você está utilizando o Chrome v62.
Você deve ter tudo o que precisa para completar o nível dentro do contrato.
Quando você souber que completou o nível, envie o contrato usando o botão enviar na parte inferior da página.
Isso envia sua instância de volta ao ethernaut, que determinará se você a concluiu.


##### Dica: Não se esqueça que você sempre pode examinar a ABI do contrato!
