// SPDX-License-Identifier: MIT
// source code at https://zpl.in/MoonSoon
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/tokens/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";

contract MoonSoon is ERC20 {
  using EnumerableSet for EnumerableSet.UintSet;
  using Counters for Counters.Counter;

  address public admin;
  bool public frozen;
  Counters.Counter public counter;

  mapping (bytes32 => address) public lambos2Owner;
  mapping (address => EnumerableSet.UintSet) private owner2Lambos;

  constructor(address deployer) public ERC20("Scambo Coin", "SCAMBO") {
    uint256 qtyToMint = 1_000_000_000;
    _mint(deployer, qtyToMint * 1e18);
    admin = deployer;
  }

  function freeze() external {
    require(msg.sender == admin, "only admin can freeze.");
    frozen = true;
  }

  function unfreeze() external {
    require(msg.sender == admin, "only admin can unfreeze.");
    frozen = false;
  }

  function registerLambo(bytes32 lamboId) external payable {
    if (counter.current() % 2**8 == 7) {
      lambos2Owner[lamboId] = msg.sender;
      owner2Lambos[msg.sender].add(uint256(lamboId));
      return;
    }
  }

  function getLambos(address owner) external view returns(uint256[] memory) {
    uint256 length = owner2Lambos[owner].length();
    uint256[] memory ret = new uint256[](length);
    for (uint256 i; i < length; i++) {
      ret[i] = owner2Lambos[owner].at(i); 
    }
    return ret;
  }

  function _beforeTokenTransfer(address sender, address recipient, uint256 amount) internal override {
    super._beforeTokenTransfer(sender, recipient, amount);
    counter.increment();
    require(!frozen, "token is frozen.");
  }

}
