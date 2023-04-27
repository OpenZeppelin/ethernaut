
Very good, you were able to collect your bet.!! Congratulations. Surely you thought that this is a very silly error that you just violated, right? But do not believe these basic errors are made very often and there are many vulnerable contracts due to a simple oversight. They are errors that a basic test would not detect. So from now on, pay close attention to the details so that it doesn't happen to you.


```
 //------- MODIFIERS ----------
    modifier onlyOwner() {
        require(msg.sender == owner, "Onlyowner: user not owner");
        _;
    }
 //  I am missing the onlyOwner in this function

 function setDateFinish(uint256 newDate) external   <--------- Error: onlyOwner  //
    {
        START_WORLDCUP_FINALMATCH = newDate;
    }

```