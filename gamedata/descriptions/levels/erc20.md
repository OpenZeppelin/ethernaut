Ever wanted to create your own ICO and strike it rich beyond your dreams?

Unfortunately that ship's sailed since it's not 2018 anymore... But you can still make your own ICO!

To pass this challenge you will need to issue your own ERC20 Token that conforms to the interface below, and issue 1000 of your tokens to the level instance contract's address.
More about the [ERC20 specification](https://theethereum.wiki/w/index.php/ERC20_Token_Standard).

```
/**
 * @title ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address who) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}
```