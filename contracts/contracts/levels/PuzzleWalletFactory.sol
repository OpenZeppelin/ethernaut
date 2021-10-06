pragma solidity ^0.6.0;

import './base/Level.sol';
import './PuzzleWallet.sol';

contract PuzzleWalletFactory is Level {

  function createInstance(address /*_player*/) override public payable returns (address) {
    require(msg.value == 1 ether, "Must send 1 ETH to create instance");

    // Deploy the Wallet logic
    PuzzleWallet walletLogic = new PuzzleWallet();
    walletLogic.init();

    // Proxy instance
    bytes data= abi.encodeWithSelector(PuzzleWallet.init.selector);
    PuzzleProxy proxy = new PuzzleProxy(address(walletLogic), data, address(this));

    data = abi.encodeWithSelector(PuzzleWallet.addToWhitelist.selector, (address(this)));
    (bool success, bytes memory result) = address(proxy).call(data);
    require(success, "Execution failed");

    data = abi.encodeWithSelector(PuzzleWallet.deposit.selector, 1 ether);
    (success, result) = address(proxy).call{ value: msg.value }(data);
    require(success, "Execution failed");

    return address(proxy);
  }

  function validateInstance(address payable _instance, address /*_player*/) override public returns (bool) {
    return _instance.balance == 0;
  }
}
