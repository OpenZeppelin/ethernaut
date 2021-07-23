// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract Funding {
    using SafeMath for uint256;

    uint256 public funds;

    function deposit() public payable {
        funds = funds.add(msg.value);
    }

    function withdrawOnlyForReceivers() public {
        payable(msg.sender).transfer(funds);
    }

    fallback() external payable {
        funds = funds.add(msg.value);
    }
}
