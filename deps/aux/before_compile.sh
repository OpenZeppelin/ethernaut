#!/bin/sh

## used to inject a mock vulnerable contract for the `HardenedToken` level

mkdir -p node_modules/@openzeppelin/contracts/tokens/ERC20 && cp deps/aux/MalERC20.sol node_modules/@openzeppelin/contracts/tokens/ERC20/ERC20.sol
