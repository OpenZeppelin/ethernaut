你可以在接口使用 `view` 函数修改器来防止状态被篡改. `pure` 修改器也可以防止状态被篡改.
认真阅读 [Solidity's documentation](http://solidity.readthedocs.io/en/develop/contracts.html#view-functions) 并学习注意事项.

完成这一关的另一个方法是构建一个 view 函数, 这个函数根据不同的输入数据返回不同的结果, 但是不更改状态, 比如 `gasleft()`.
