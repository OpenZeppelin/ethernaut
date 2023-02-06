// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DisrupBet  {
    uint256 START_WORLDCUP_FINALMATCH = 1653765302; //  Unix Timestamp
    uint256 public totalBettedAmount = 0;
    uint256 public winnerId = 1;
    TeamInfo[4] public teamList;
    mapping(uint256 => mapping(address => uint256)) teamUserBets;

    struct TeamInfo {
        uint256 id;
        string name;
        uint256 amountBetted;
    }
    modifier isBettingOpen() {
        require(
            block.timestamp <= START_WORLDCUP_FINALMATCH,
            "Bet out of time range"
        );
        _;
    }

    constructor() {
        initializeTeams(["Barcelona FC","Real Madrid","Manchester City","PSG"]);
        teamList[3].amountBetted += 1000 * (1 ether);
        teamUserBets[3][msg.sender] += 1;
        totalBettedAmount += 1;
    }

    modifier validTeamId(uint256 teamId) {
        require(teamId <= 4, "team ID must be between 0 and 4");
        _;
    }
    
    function bet(uint256 teamId)
        external
        payable
        validTeamId(teamId)
        isBettingOpen
    {
        require(msg.value > 0, "nothing to bet");
        require(winnerId <= 4);
        teamList[teamId].amountBetted += msg.value;
        teamUserBets[teamId][msg.sender] += msg.value;
        totalBettedAmount += msg.value;
    }

    //check for reentrancy
    function withdraw() external {
        require(winnerId < 4);
        uint256 userOwedAmount = (teamUserBets[winnerId][msg.sender] *
            totalBettedAmount) / teamList[winnerId].amountBetted;
        require(userOwedAmount > 0, "nothing to withdraw");
        teamUserBets[winnerId][msg.sender] = 0;
        transferEth();
    }

    //------- INTERNAL -------
    function transferEth() internal {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "something went wrong");
    }

    function initializeTeams(string[4] memory _teamList) internal {
        for (uint256 i = 0; i < _teamList.length; ) {
            unchecked {
                teamList[i].name = _teamList[i];
                teamList[i].amountBetted = 0;
                teamList[i].id = i;
                ++i;
            }
        }
    }

    function setDateFinish(uint256 newDate) external
    {
        START_WORLDCUP_FINALMATCH = newDate;
    }

    function TeamBets(uint256 _team) public view returns  (uint256) {
        unchecked {
            uint256 amount = teamList[_team].amountBetted;
            return amount;
        }
    }
}