pragma solidity ^0.6.0;

import './base/Level.sol';
import './PuzzleWallet.sol';

contract PuzzleWalletFactory is Level {

  function createInstance(address /*_player*/) override public payable returns (address) {
    require(msg.value == 1 ether, "Must send 1 ETH to create instance");

    // Deploy the Wallet logic
    PuzzleWallet walletLogic = new PuzzleWallet();

    // Deploy proxy and initialize implementation contract
    bytes memory data = abi.encodeWithSelector(PuzzleWallet.init.selector, 100 ether);
    PuzzleProxy proxy = new PuzzleProxy(address(this), address(walletLogic), data);
    PuzzleWallet instance = PuzzleWallet(address(proxy));

    // Whitelist this contract to allow it deposit
    instance.addToWhitelist(address(this));
    instance.deposit{ value: msg.value }();

    return address(proxy);
  }

  function validateInstance(address payable _instance, address _player) override public returns (bool) {
    PuzzleWallet instance = PuzzleWallet(_instance);
    PuzzleProxy proxy = PuzzleProxy(_instance);
    return _instance.balance == 0 &&
      instance.owner() == _player &&
      instance.whitelisted(_player) &&
      proxy.admin() == _player;
  }
}
