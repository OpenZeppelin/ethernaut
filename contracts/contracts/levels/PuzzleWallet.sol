// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

contract PuzzleWallet {
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

        for (uint256 i = 0; i < data.length; i++) {
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
        balances[msg.sender] = balances[msg.sender] + amount;
    }
    
    function execute(address to, uint256 value, bytes calldata data) external payable onlyWhitelisted returns(bytes memory) {
        uint256 currentBalance = balances[msg.sender];
        require(currentBalance >= value, "Insufficient balance");
        balances[msg.sender] = currentBalance - value;
        (bool success, bytes memory result) = to.call{value: value}(data);
        require(success, "Execution failed");
        return result;
    }
}
