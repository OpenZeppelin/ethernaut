// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {FlashQuorumToken} from "./FlashQuorumToken.sol";

/// @notice A tiny DAO treasury.
contract FlashQuorum {
    FlashQuorumToken public immutable govToken;
    uint256 public immutable quorum;
    bool public drained;

    constructor(FlashQuorumToken _govToken, uint256 _quorum) payable {
        govToken = _govToken;
        quorum = _quorum;
    }

    function executeProposal(address payable beneficiary) external {
        require(govToken.balanceOf(msg.sender) >= quorum, "Not enough votes");
        require(!drained, "Proposal already executed");
        drained = true;
        beneficiary.transfer(address(this).balance);
    }
}
