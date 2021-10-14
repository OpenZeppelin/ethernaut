// SPDX-License-Identifier: MIT

pragma solidity <0.7.0;

import "./base/Level.sol";
import "./Motorbike.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract MotorbikeFactory is Level {

  Engine public engine;
  Motorbike public motorbike;

  function createInstance(address _player) public payable override returns (address) {
    _player;

    engine = new Engine();
    motorbike = new Motorbike(address(engine));

    require(
        keccak256(Address.functionCall(
            address(motorbike),
            abi.encodeWithSignature("upgrader()")
        )) == keccak256(abi.encode(address(this))), 
        "Wrong upgrader address"
    );

    require(
        keccak256(Address.functionCall(
            address(motorbike),
            abi.encodeWithSignature("horsePower()")
        )) == keccak256(abi.encode(uint256(1000))), 
        "Wrong horsePower"
    );

    return address(motorbike);
  }

  function validateInstance(address payable _instance, address _player) public override returns (bool) {
    _player;
    _instance;
    return !Address.isContract(address(engine));
  }
}