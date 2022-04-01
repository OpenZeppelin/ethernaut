// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface DelegateERC20 {
  function delegateTransfer(address to, uint256 value, address origSender) external returns (bool);
}

interface IAgent {
    function handleTransaction(address user) external returns(bool);
}

interface IForta {
    function setAgent(address agentAddress) external;
    function notify(address user) external returns(bool);
    function raiseAlert(address user) external;
}

contract Forta is IForta {
  mapping(address => IAgent) public usersAgent;
  mapping(address => uint256) public agentRaisedAlerts;

  function setAgent(address agentAddress) external override {
      require(address(usersAgent[msg.sender]) == address(0), "Agent already set");
      usersAgent[msg.sender] = IAgent(agentAddress);
  }

  function notify(address user) external override returns(bool) {
    require(address(usersAgent[user]) != address(0), "Can't find a suitable agent for user");
    require(usersAgent[user].handleTransaction(user), "Failed handling transaction");
    return true;
  }

  function raiseAlert(address user) external override {
      require(address(usersAgent[user]) == msg.sender, "Caller is not agent");
      agentRaisedAlerts[msg.sender] += 1;
  } 
}

contract CryptoVault {
    address public sweptTokensRecipient;
    IERC20 public underlying;

    constructor(address recipient) public {
        sweptTokensRecipient = recipient;
    }

    function setUnderlying(address latestToken) public {
        require(address(underlying) == address(0), "Already set");
        underlying = IERC20(latestToken);
    }

    //
    // CryptoVault code
    //

    function sweepToken(IERC20 token) public {
        require(token != underlying, "Can't transfer underlying token");
        token.transfer(sweptTokensRecipient, token.balanceOf(address(this)));
    }
}

contract LegacyToken is ERC20("LegacyToken", "LGT"), Ownable {
    DelegateERC20 public delegate;

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function delegateToNewContract(DelegateERC20 newContract) public onlyOwner {
        delegate = newContract;
    }

    function transfer(address to, uint256 value) public override returns (bool) {
        if (address(delegate) == address(0)) {
            return super.transfer(to, value);
        } else {
            return delegate.delegateTransfer(to, value, msg.sender);
        }
    }
}

contract DoubleEntryPoint is ERC20("DoubleEntryPointToken", "DET"), DelegateERC20, Ownable {
    address public cryptoVault;
    address public player;
    address public delegatedFrom;
    Forta public forta;

    constructor(address legacyToken, address vaultAddress, address fortaAddress, address playerAddress) public {
        delegatedFrom = legacyToken;
        forta = Forta(fortaAddress);
        player = playerAddress;
        cryptoVault = vaultAddress;
        _mint(cryptoVault, 100 ether);
    }

    modifier onlyDelegateFrom() {
        require(msg.sender == delegatedFrom, "Not legacy contract");
        _;
    }

    modifier fortaNotify() {
        // Cache old number of agent alerts
        uint256 previousValue = forta.agentRaisedAlerts(agentAddress);

        // Notify Forta
        require(forta.notify(player),"Failed notifying forta");
        
        // Continue execution
        _;

        // Check if alarms have been raised
        if(forta.agentRaisedAlerts(agentAddress) > previousValue) revert("Alert has been triggered, reverting");
    }

    function delegateTransfer(
        address to,
        uint256 value,
        address origSender
    ) public override onlyDelegateFrom fortaNotify returns (bool) {
        _transfer(origSender, to, value);
        return true;
    }
}
