pragma solidity ^0.4.24;

contract MagicNumSolver {
  function createSolver() public returns (address) {
      
    address addr;
    uint256 size;
      
    assembly {
          
      // This is the code we want to return.
      // 00 PUSH1 42 /* push 42 onto the stack */
      // 03 PUSH1  0 /* store 42 at memory position 0 */
      // 05 MSTORE
      // 06 PUSH1  1 /* return 1 byte at memory offset 31 */
      // 08 PUSH1 1f
      // 10 RETURN
      // Bytecode: 0x60426000526001601ff3 (length 0x0a or 10)
      
      // With deploy code (created using evm-deploy):
      // 0x600a80600b6000396000f360426000526001601ff3 (length 0x15 or 21)
      
      // Within a word:
      // 0x0000000000000000000000600a80600b6000396000f360426000526001601ff3
      //                         ^ (offset 0x0b or 11)     
      
      // Store the bytecode in memory so that it can be used to create a new "contract".
      mstore(0, 0x600a80600b6000396000f360426000526001601ff3)
      
      // Create a contract whose code is what's stored at mem pos 0.
      addr := create(0, 0x0b, 0x15)
      
      // Verify created contract code size.
      size := extcodesize(addr)
    }
    require(size <= 10);
      
    return addr;
  }
}
