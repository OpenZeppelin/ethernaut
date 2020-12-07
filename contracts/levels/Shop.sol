pragma solidity >=0.6.4 <0.8.0;

interface Buyer {
  function price() external view returns (uint);
}

contract Shop {
  uint public price = 100;
  bool public isSold;

  function buy() public {
    Buyer _buyer = Buyer(msg.sender);

    if (_buyer.price{gas: 3000}() >= price && !isSold) {
      isSold = true;
      price = _buyer.price{gas: 3000}();
    }
  }
}
