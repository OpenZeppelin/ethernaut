pragma solidity ^0.4.23;

contract Door{

    uint private password;
    bool public open;

    function Door(uint psw) public {
        password = psw;
        open = false;
    }

    function unlock() public view{
        open = true;
    }

    function backDoor(address adr, bytes4 prm, uint key) public returns(bool){
        require(password == key);
        require(msg.sender == tx.origin);
        return adr.call( prm );
    }
}
