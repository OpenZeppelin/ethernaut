Overflow 在 solidity 中非常常见, 你必须小心检查, 比如下面这样:
```
if(a + c > a) {
  a = a + c;
}
```

另一个简单的方法是使用 OpenZeppelin 的 SafeMath 库, 它会自动检查所有数学运算的溢出, 可以像这样使用:
```
a = a.add(c);
``` 
如果有溢出, 代码会自动恢复.
