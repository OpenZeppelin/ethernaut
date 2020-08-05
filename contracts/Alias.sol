pragma experimental ABIEncoderV2;
pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Alias is Ownable {
    using AliasFilter for string;
    event AliasSetLog(address indexed player, bytes32 indexed alias);

    struct PlayerAlias {
        address player;
        bytes32 alias;
    }

    PlayerAlias[] public playerAlias_;
    mapping(address => uint256) public playerIndex_;
    mapping(bytes32 => uint256) public aliasIndex_;

    function aliasOf(address _player) public view returns (bytes32) {
        uint256 index = playerIndex_[_player];

        if (index == 0) return;

        return playerAlias_[index - 1].alias;
    }

    function addressOf(bytes32 _alias) public view returns (address) {
        uint256 index = aliasIndex_[_alias];

        if (index == 0) return address(0);

        return playerAlias_[index - 1].player;
    }

    function isValidAlias(string _alias) public view returns(bool) {
        bytes32 alias = _alias.aliasFilter();
        
        if (aliasIndex_[alias] == 0) return true;

        return false;
    }

    function getPlayerAlias() public view returns(PlayerAlias[]) {
        return playerAlias_;
    }

    function getCount() public view returns(uint256) {
        return playerAlias_.length;
    }

    function setAlias(string _alias) public {
        bytes32 alias = _alias.aliasFilter();
        require(aliasIndex_[alias] == 0, "alias is already taken");

        uint256 index = playerIndex_[msg.sender];
        // new alias
        if (index == 0) {
            playerAlias_.push(PlayerAlias(msg.sender, alias));
            playerIndex_[msg.sender] = playerAlias_.length;
            aliasIndex_[alias] = playerAlias_.length;
        }
        else {
            // overwrite old alias
            PlayerAlias storage oldAlias = playerAlias_[index - 1];
        
            // reset previous alias
            aliasIndex_[oldAlias.alias] = 0;

            // set alias
            oldAlias.alias = alias;
            aliasIndex_[oldAlias.alias] = index;
        }

        emit AliasSetLog(msg.sender, alias);
    }

    // allow owner to override unacceptable names
    function overrideAlias(bytes32 _alias) public onlyOwner {
        uint256 ownerIndex = playerIndex_[msg.sender];
        require(ownerIndex > 0, "owner must set their alias first");
        uint256 index = aliasIndex_[_alias];
        require(index > 0, "alias does not exist");
        // do not allow owner to override alias
        require(ownerIndex != index, "owner cannot override their own alias");
        
        // orphan the alias to the owner
        aliasIndex_[_alias] = ownerIndex;

        address player = playerAlias_[index - 1].player;
        // set players whose alias has been overriden to 0
        playerIndex_[player] = 0;

        // last item is being overridden, no need to shift items
        if (index != playerAlias_.length) 
        {
            // move the last item into the index being vacated
            PlayerAlias storage lastPlayerAlias = playerAlias_[playerAlias_.length - 1];

            playerAlias_[index - 1] = lastPlayerAlias;  // adjust for 1-based indexing
            playerIndex_[lastPlayerAlias.player] = index;
            aliasIndex_[lastPlayerAlias.alias] = index;
        }

        // remove last item in the collection now that it has been copied
        playerAlias_.length -= 1;

        emit AliasSetLog(player, 0);
    }
}

library AliasFilter {
    /*
    converts uppercase to lower case.  
    makes sure it does not start/end with a space
    makes sure it does not contain multiple spaces in a row
    cannot be only numbers
    cannot start with 0x 
    restricts characters to A-Z, a-z, 0-9, and space.
    @return reprocessed alias in bytes32 format
    */
    function aliasFilter(string _alias) internal pure returns(bytes32) {
        bytes memory _tempAlias = bytes(_alias);
        uint256 _length = _tempAlias.length;
        
        //sorry limited to 32 characters
        require (_length <= 32 && _length > 0, "alias must be between 1 and 32 characters");
        // make sure it doesnt start with or end with space
        require(_tempAlias[0] != 0x20 && _tempAlias[_length-1] != 0x20, "alias cannot start or end with space");
        // make sure first two characters are not 0x
        if (_tempAlias[0] == 0x30)
        {
            require(_tempAlias[1] != 0x78, "alias cannot start with 0x");
            require(_tempAlias[1] != 0x58, "alias cannot start with 0X");
        }
        
        // create a bool to track if we have a non number character
        bool _hasNonNumber;
        
        // convert & check
        for (uint256 i = 0; i < _length; i++)
        {
            // if its uppercase A-Z
            if (_tempAlias[i] > 0x40 && _tempAlias[i] < 0x5b)
            {
                // convert to lower case a-z
                _tempAlias[i] = byte(uint(_tempAlias[i]) + 32);
                
                // we have a non number
                if (_hasNonNumber == false)
                    _hasNonNumber = true;
            } else {
                require
                (
                    // require character is a space
                    _tempAlias[i] == 0x20 || 
                    // OR lowercase a-z
                    (_tempAlias[i] > 0x60 && _tempAlias[i] < 0x7b) ||
                    // or 0-9
                    (_tempAlias[i] > 0x2f && _tempAlias[i] < 0x3a),
                    "alias contains invalid characters"
                );
                // make sure theres not 2x spaces in a row
                if (_tempAlias[i] == 0x20)
                    require( _tempAlias[i+1] != 0x20, "alias cannot contain consecutive spaces");
                
                // see if we have a character other than a number
                if (_hasNonNumber == false && (_tempAlias[i] < 0x30 || _tempAlias[i] > 0x39))
                    _hasNonNumber = true;    
            }
        }
        
        require(_hasNonNumber == true, "alias cannot be only numbers");
        
        bytes32 _return;
        assembly {
            _return := mload(add(_tempAlias, 32))
        }
        return (_return);
    }
}