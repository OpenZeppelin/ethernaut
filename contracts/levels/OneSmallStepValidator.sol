pragma solidity ^0.5.0;

interface IOneSmallStep {
  function quote() external pure returns (string memory);
}

contract OneSmallStepValidator {
  string private quote = "That's one small step for man, one giant leap for mankind.";
  bool public cleared = false;

  function submitContract(address _contract) public {
    string memory contractQuote = IOneSmallStep(_contract).quote();
    if(keccak256(bytes(contractQuote)) == keccak256(bytes(quote))) {
      cleared = true;
    }
  }
}