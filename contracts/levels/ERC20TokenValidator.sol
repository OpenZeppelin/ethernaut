/* Instructions

    Create an ERC20 token conforming to the IERC20.sol interface, then transfer 1000 tokens to the level contract.
    A battery of tests will be run against your submitted token contract address to check that it behaves as expected
*/

// player should have transferred some tokens to validator contract (1000)?

pragma solidity ^0.5.0;

import "../utils/IERC20.sol";

contract TokenGrabbingContract {
  IERC20 token;
  constructor(IERC20 _token) public {
    token = _token;
  }

  function getTokens() public {
    token.transferFrom(msg.sender, address(this), 50);
  }
}

contract ERC20TokenValidator {
  bool public cleared = false;
  address anotherAccount = address(new TokenGrabbingContract(IERC20(address(0x0)))); // random account address

  function submitContract(address answer) public {
    IERC20 token = IERC20(answer);

    require(testTotalSupply(token), "Failed totalSupply check");
    require(testBalanceOf(token), "Failed balanceOf check");
    require(testTransfer(token), "Failed transfer check");
    require(
      testApproveTransfer(token),
      "Failed approve and transferFrom check"
    );

    cleared = true;
  }

  function testTotalSupply(IERC20 token) internal view returns (bool) {
    return (token.totalSupply() == 1000);
  }

  function testBalanceOf(IERC20 token) internal view returns (bool) {
    uint REQUIRED_TOKEN_VALUE = 1000;
    bool testBalanceOfAnotherAccount = (token.balanceOf(anotherAccount) == 0);
    bool testBalanceOfThisAccount = (token.balanceOf(
      address(this)
    ) == REQUIRED_TOKEN_VALUE);

    return (testBalanceOfThisAccount && testBalanceOfAnotherAccount);
  }

  function testTransfer(IERC20 token) internal returns (bool) {
    uint balanceOfAnotherAccount = token.balanceOf(anotherAccount);
    token.transfer(anotherAccount, 50);
    bool testTransferWhenSufficientBalance = (token.balanceOf(
      anotherAccount
    ) - balanceOfAnotherAccount == 50);

    // we need low level calls to allow contract to throw without killing our test
    // solium-disable-next-line security/no-low-level-calls
    (bool testTransferFailsWhenInsufficientBalance, ) = address(token).call(
      abi.encodeWithSignature("transfer(address,uint256)", anotherAccount, 5000)
    );

    return !testTransferFailsWhenInsufficientBalance && testTransferWhenSufficientBalance;
  }

  function testApproveTransfer(IERC20 token) internal returns (bool) {
    TokenGrabbingContract grabber = new TokenGrabbingContract(token);
    // solium-disable-next-line security/no-low-level-calls
    (bool testTransferBeforeApprovalShouldFail, ) = address(grabber).call(
      abi.encodeWithSignature("getTokens()")
    );
    bool priorBalanceShouldBeZero = (token.balanceOf(address(grabber)) == 0);
    token.approve(address(grabber), 50);
    grabber.getTokens();
    bool posteriorBalanceShouldBeFifty = (token.balanceOf(
      address(grabber)
    ) == 50);

    return (priorBalanceShouldBeZero && posteriorBalanceShouldBeFifty && !testTransferBeforeApprovalShouldFail);
  }

}
