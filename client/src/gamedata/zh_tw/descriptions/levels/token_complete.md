溢位(overflow)在 solidity 中非常常見，你必須小心檢查。比如下面這樣：

```
if(a + c > a) {
  a = a + c;
}
```

另一個更簡單的替代方案是使用 OpenZeppelin 的 SafeMath 函式庫，它會自動檢查所有數學運算的溢位。使用方法大概如下：

```
a = a.add(c);
``` 

如果有溢位，程式會自動恢復(revert).