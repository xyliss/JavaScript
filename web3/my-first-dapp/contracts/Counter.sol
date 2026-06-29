// contracts/Counter.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Counter {
    uint256 private count;
    // 事件：当数字变化时触发
    event CountChanged(uint256 newCount);
    // 构造函数：初始化 count 为 0
    constructor() {
        count = 0;
        emit CountChanged(count);
    }
    // 增加 1
    function increment() public {
        count += 1;
        emit CountChanged(count);
    }
    // 减少 1
    function decrement() public {
        require(count > 0, "Cannot go below zero");
        count -= 1;
        emit CountChanged(count);
    }
    // 获取当前数字
    function getCount() public view returns (uint256) {
        return count;
    }
}
