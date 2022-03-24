// SPDX-License-Identifier: MIT

pragma solidity <0.7.0;

import "./base/Level.sol";
import "./Motorbike.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract MotorbikeFactory is Level {

  mapping(address => address) private engines;

  function createInstance(address _player) public payable override returns (address) {
    _player;

    Engine engine = new Engine();
    Motorbike motorbike = new Motorbike(address(engine));
    engines[address(motorbike)] = address(engine);

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
    return !Address.isContract(engines[_instance]);
  }
}