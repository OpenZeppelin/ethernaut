// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./base/Level.sol";
import "./SignatureCoin.sol";

contract SignatureCoinFactory is Level {
    // this represents an arbitrary transaction signature that was computed offline
    address constant source = 0xb7acF2dC3BC5C40F7e99991C623a7469af1F03F9;
    address constant recipient = 0x3Dd8e463A4786CbE0AEFc88f6fD3fc08EeC39c0e;
    uint256 constant amount = 5 * 10**18;
    uint256 constant nonce = 1;
    bytes32 constant r =
        0x3311019efd630afe231491d2afcfc626870880e99ff5907a814f55539bf1955f;
    bytes32 constant s =
        0x08dcefa95e708b229636cfe4f952c87721daccd45248e0fd78e32b1ae5e33f21;
    uint8 constant v = 27;
    uint256 constant balance = 95 * 10**18;

    function createInstance(address) public payable override returns (address) {
        SignatureCoin token = new SignatureCoin(source);
        token.transferWithSignature(recipient, amount, nonce, r, s, v);
        return address(token);
    }

    function validateInstance(address payable _instance, address)
        public
        view
        override
        returns (bool)
    {
        SignatureCoin coin = SignatureCoin(_instance);
        return coin.balanceOf(source) < balance;
    }
}
