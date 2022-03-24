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
  event AddressesAre(address, address);

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

contract CryptoVault {
    address public sweptTokensRecipient;
    IERC20Upgradeable public underlying;

    constructor(address recipient, address latestToken) public {
        sweptTokensRecipient = recipient;
        underlying = IERC20Upgradeable(latestToken);
    }

    //
    // CryptoVault code
    //

    function sweepToken(IERC20Upgradeable token) public {
        require(token != underlying, "Can't transfer underlying token");
        token.transfer(sweptTokensRecipient, token.balanceOf(address(this)));
    }
}

contract LegacyToken is ERC20Upgradeable, OwnableUpgradeable {
    DelegateERC20 public delegate;

    constructor () public {
        __ERC20_init("LegacyToken", "LGT");
        __Ownable_init();
    }

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

contract DoubleEntryPoint is ERC20Upgradeable, DelegateERC20, OwnableUpgradeable {
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
        return true;
    }
}
