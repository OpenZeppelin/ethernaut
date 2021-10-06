// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";

import "@openzeppelin/contracts/proxy/UpgradeableProxy.sol";

contract PuzzleProxy is UpgradeableProxy {
    address public pendingAdmin;
    address public admin;

    constructor(address _implementation, address _admin) UpgradeableProxy(_implementation, "") public {
        admin = _admin;
    }

    // Anyone can propose a new admin, but the current admin must accept the change in the `changeAdmin` function
    function proposeNewAdmin(address _newAdmin) external {
        pendingAdmin = _newAdmin;
    }

    function changeAdmin(address expectedAdmin) external {
        require(msg.sender == admin, "Caller is not the admin");
        require(expectedAdmin == pendingAdmin, "Expected new admin by the current admin is not the pending admin");
        admin = pendingAdmin;
    }
}

contract PuzzleWallet {
    using SafeMath for uint256;
    address public owner;
    uint256 public maxBalance = uint256(-1);
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
