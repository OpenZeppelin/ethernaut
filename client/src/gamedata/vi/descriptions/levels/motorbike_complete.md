The advantage of following an UUPS pattern is to have very minimal proxy to be deployed. The proxy acts as storage layer so any state modification in the implementation contract normally doesn't produce side effects to systems using it, since only the logic is used through delegatecalls.

This doesn't mean that you shouldn't watch out for vulnerabilities that can be exploited if we leave an implementation contract uninitialized.

This was a slightly simplified version of what has really been discovered after months of the release of UUPS pattern. 

Takeways: never leave implementation contracts uninitialized ;) 

If you're interested in what happened, read more [here](https://forum.openzeppelin.com/t/uupsupgradeable-vulnerability-post-mortem/15680).