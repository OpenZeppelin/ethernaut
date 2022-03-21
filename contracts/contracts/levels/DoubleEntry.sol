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

contract DEX {
    IERC20 public underlying;
    address public sweptTokensRecipient;

    constructor(address recipient, address latestToken) public {
        underlying = IERC20(latestToken);
        sweptTokensRecipient = recipient;
    }

    //
    // DEX code
    //

    function sweepToken(IERC20 token) public {
        require(token != underlying, "Can't transfer underlying token");
        token.transfer(sweptTokensRecipient, token.balanceOf(address(this)));
    }
}

contract LegacyToken is ERC20("LegacyToken", "LGT"), Ownable {
    // If this contract needs to be upgraded, the new contract will be stored
    // in 'delegate' and any ERC20 calls to this contract will be delegated to that one.
    DelegateERC20 public delegate;

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Can undelegate by passing in newContract = address(0)
    function delegateToNewContract(DelegateERC20 newContract) public onlyOwner {
        delegate = newContract;
    }

    // If a delegate has been designated, all ERC20 calls are forwarded to it
    function transfer(address to, uint256 value) public override returns (bool) {
        if (address(delegate) == address(0)) {
            return super.transfer(to, value);
        } else {
            return delegate.delegateTransfer(to, value, msg.sender);
        }
    }
}

contract DoubleEntry is ERC20("LatestToken", "LTT"), DelegateERC20, Ownable {
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
        fortaAgent.handleTransaction(delegatedCalls, owner(), player);
        return true;
    }
}
