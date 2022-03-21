// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface NotificationReceiver {
  function receiveAgentNotification(uint256 value, address player) external;
}

interface DelegateERC20 {
  function delegateTransfer(address to, uint256 value, address origSender) external returns (bool);
}

contract Agent {
  address public attachedEmissor;

  constructor (address emittingAddress) public {
      attachedEmissor = emittingAddress;
  }

  function handleTransaction(uint256 value, address destination, address player) public {
    require(msg.sender == attachedEmissor, "Unauthorized");
    NotificationReceiver(destination).receiveAgentNotification(value, player);
  }
}

contract DoubleEntryAttack is ERC20("LatestToken", "LTT"), DelegateERC20, Ownable {
    address public dex;
    address public player;
    address public delegatedFrom;
    uint256 public delegatedCalls;
    bool public initialized;
    Agent public fortaAgent;

    function initialize(address legacyToken, address dexAddress, address agent, address playerAddress) public {
        require(!initialized, "Contract already initialized");
        initialized = true;
        delegatedFrom = legacyToken;
        fortaAgent = Agent(agent);
        player = playerAddress;
        dex = dexAddress;
        _mint(dex, 100 ether);
    }

    // require msg.sender is the delegate smart contract
    modifier onlyDelegateFrom() {
        require(msg.sender == delegatedFrom);
        _;
    }

    function delegateTransfer(
        address to,
        uint256 value,
        address origSender
    ) public override onlyDelegateFrom returns (bool) {
        _transfer(origSender, to, value);
        delegatedCalls += 1;
        return true;
    }
}
