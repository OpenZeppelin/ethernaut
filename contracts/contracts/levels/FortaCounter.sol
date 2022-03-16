// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/utils/Address.sol";

interface NotificationReceiver {
  function receiveAgentNotification(uint256 value, address player) external;
}

contract Agent {
  function handleTransaction(uint256 value, address factory, address player) public {
    NotificationReceiver(factory).receiveAgentNotification(value, player);
  }
}

contract FortaCounter {
  uint256 public counter;
  Agent public agent;
  address public factory;
  address public player;

  constructor(address _factory, address _player) public {
    agent = new Agent();
    factory = _factory;
    player = _player;
  }

  function increment() public {
    counter += 1;
    agent.handleTransaction(counter, factory, player);
  }
}

contract CounterProxy {
    // keccak-256 hash of "eip1967.proxy.implementation" subtracted by 1
    bytes32 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
    
    struct AddressSlot {
        address value;
    }
    
    // Initializes the upgradeable proxy with an initial implementation specified by `_logic`.
    constructor(address _logic) public {
        require(Address.isContract(_logic), "ERC1967: new implementation is not a contract");
        _getAddressSlot(_IMPLEMENTATION_SLOT).value = _logic;
    }

      // Delegates the current call to `implementation`.
    function _delegate(address implementation) public virtual {
        // solhint-disable-next-line no-inline-assembly
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), implementation, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }

    // Fallback function that delegates calls to the address returned by `_implementation()`. 
    // Will run if no other function in the contract matches the call data
    fallback () external virtual {
        _delegate(_getAddressSlot(_IMPLEMENTATION_SLOT).value);
    }
    
    // Returns an `AddressSlot` with member `value` located at `slot`.
    function _getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
        assembly {
            r_slot := slot
        }
    }
}
