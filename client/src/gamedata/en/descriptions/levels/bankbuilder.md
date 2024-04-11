 BankBuilder is the contract used to deploy Bank Contract. When BankBuilder instance is created, Bank contract is also deployed with 0.001 ethers.

 Bank Contract can deploy Recipent contract.

 Bank Contract has grouped the list of 10 addresses of different Recipent contracts in order, but not deployed yet. The address of Recipent contract to be deployed first is at position no. 1 on list, the address to be deployed second is on position no. 2 on list and so on. 
 
 Accidently when Bank Contract is deployed all the funds in Bank Contract is transfered to 5th Recipent address.
 Now the funds are stuk on 5th Recipent address.

 Your Goal is to retrive the funds back to BankBuilder contract ! 

&nbsp;
Things that might help
* Understanding how address of contract is computed.
* Understanding how catching of one datatype to other works.