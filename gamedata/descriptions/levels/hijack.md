
A contract creator has built a very simple token factory contract. Anyone can create new tokens with ease. However, it seems that in the deployment process the creator mistakenly sent `0.5` ether to two separate, unowned addresses. These are given by the two addresses, `address1` and `address2`. 

The creator is obsessed with their loss, and is tracking the addresses. If you can relieve their obsession by passing the following condition, the level will be passed.

`address1.balance + address2.balance < 1 ether`. 

