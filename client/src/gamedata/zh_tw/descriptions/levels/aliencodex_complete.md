這一關利用了 EVM 不會去檢驗一個陣列的 ABI-encoded 長度和它真實的 payload。

並且它利用了陣列長度的溢出(underflow)，透過擴大陣列到整個 `2^256` 的儲存區域. 然後使用使用者就可以更改所有合約的 storage 了.

這兩個漏洞都是受到 2017 年的 [Underhanded coding contest](https://medium.com/@weka/announcing-the-winners-of-the-first-underhanded-solidity-coding-contest-282563a87079) 啟發
