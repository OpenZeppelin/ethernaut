// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract Proxy {
    address public pendingAdmin;
    bytes32 public constant ADMIN_SLOT = 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;
    bytes32 public constant IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    constructor(address _implementation, address _admin) public {
        bytes32 adminSlot = ADMIN_SLOT;
        bytes32 implSlot = IMPLEMENTATION_SLOT;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            sstore(implSlot, _implementation)
            sstore(adminSlot, _admin)
        }
    }

    modifier onlyAdmin {
      bytes32 adminSlot = ADMIN_SLOT;
      address admin;

      assembly {
          admin := sload(adminSlot)
      }

      require(msg.sender == admin, "Caller is not the admin");
      _;
    }

    // Anyone can propose a new admin, but the current admin can just reject it or never accept it
    function proposeNewAdmin(address _newAdmin) external {
      pendingAdmin = _newAdmin;
    }

    function updateAdmin() external onlyAdmin {
      bytes32 slot = ADMIN_SLOT;
      address newAdmin = pendingAdmin;
      // solhint-disable-next-line no-inline-assembly
      assembly {
          sstore(slot, newAdmin)
      }
    }

    fallback() external payable {
        // solhint-disable-next-line no-inline-assembly
        bytes32 slot = IMPLEMENTATION_SLOT;
        address impl;
        assembly {
            impl := sload(slot)
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())

            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
}

contract PuzzleWallet {
    using SafeMath for uint256;
    address public owner;
    mapping(address => bool) public whitelisted;
    mapping(address => uint256) public balances;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier onlyWhitelisted {
        require(whitelisted[msg.sender], "Not whitelisted");
        _;
    }

    function addToWhitelist(address addr) external onlyOwner {
        whitelisted[addr] = true;
    }
    
    // Adapted from https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Multicall.sol#L16
    function multicall(bytes[] calldata data) external onlyWhitelisted returns (bytes[] memory results) {
        results = new bytes[](data.length);

        // Protect against reusing msg.value
        bool depositCalled = false;

        for (uint256 i = 0; i < data.length; i.add(1)) {
            bytes memory _data = data[i];
            bytes4 selector;
            assembly {
                selector := mload(add(_data, 32))
            }

            if (selector == this.deposit.selector) {
                require(!depositCalled, "Deposit can only be called once");
                depositCalled = true;
            }

            (bool success, bytes memory returndata) = address(this).delegatecall(data[i]);
            if (!success) {
                // Look for revert reason and bubble it up if present
                if (returndata.length > 0) {
                    // The easiest way to bubble the revert reason is using memory via assembly
                    assembly {
                        let returndata_size := mload(returndata)
                        revert(add(32, returndata), returndata_size)
                    }
                } else {
                    revert();
                }
            }
            results[i] = returndata;
        }
        return results;
    }

    function deposit(uint256 amount) external onlyWhitelisted payable {
        require(amount == msg.value);
        // Add to sender's balance
        balances[msg.sender] = balances[msg.sender].add(amount);
    }
    
    function execute(address to, uint256 value, bytes calldata data) external payable onlyWhitelisted returns(bytes memory) {
        uint256 currentBalance = balances[msg.sender];
        require(currentBalance >= value, "Insufficient balance");
        balances[msg.sender] = currentBalance.sub(value);
        (bool success, bytes memory result) = to.call{ value: value }(data);
        require(success, "Execution failed");
        return result;
    }
}
