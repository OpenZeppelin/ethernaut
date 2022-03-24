// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

interface NotificationReceiver {
  function receiveAgentNotification(address player) external;
}

interface DelegateERC20 {
  function delegateTransfer(address to, uint256 value, address origSender) external returns (bool);
}

contract Agent {
  address public attachedEmissor;
  bool public emissorSet;

  function setEmissor(address emittingAddress) public {
      require(!emissorSet, "Already set");
      emissorSet = true;
      attachedEmissor = emittingAddress;
  }

  function handleTransaction(address destination, address player) public {
    require(msg.sender == attachedEmissor, "Unauthorized");
    NotificationReceiver(destination).receiveAgentNotification(player);
  }
}

contract DoubleEntryPointAttack is ERC20Upgradeable, DelegateERC20, OwnableUpgradeable {
    address public cryptoVault;
    address public player;
    address public delegatedFrom;
    Agent public fortaAgent;

    function initialize(address legacyToken, address vaultAddress, address agent, address playerAddress) initializer public {
        delegatedFrom = legacyToken;
        fortaAgent = Agent(agent);
        player = playerAddress;
        cryptoVault = vaultAddress;
        __ERC20_init_unchained("DoubleEntryPointToken", "DET");
        __Ownable_init_unchained();
        _mint(cryptoVault, 100 ether);
    }

    modifier onlyDelegateFrom() {
        require(msg.sender == delegatedFrom, "Not legacy contract");
        _;
    }

    function delegateTransfer(
        address to,
        uint256 value,
        address origSender
    ) public override onlyDelegateFrom returns (bool) {
        _transfer(origSender, to, value);
        fortaAgent.handleTransaction(owner(), player);
        return true;
    }
}
