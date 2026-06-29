// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Bank {
    address public admin;
    uint public withdrawLimit;

    struct Transaction {
        string txType;
        uint amount;
        address target;
        uint timestamp;
    }

    mapping(address => uint) private balances;
    mapping(address => Transaction[]) private records;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor() {
        admin = msg.sender;
        withdrawLimit = 5 ether;
    }

    // 存款
    function deposit() public payable {
        require(msg.value > 0, "Amount must > 0");

        balances[msg.sender] += msg.value;

        records[msg.sender].push(
            Transaction(
                "Deposit",
                msg.value,
                msg.sender,
                block.timestamp
            )
        );
    }

    // 查询余额
    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }

    // 取款
    function withdraw(uint amount) public {
        require(amount > 0, unicode"输入金额无效");
        require(
            balances[msg.sender] >= amount,
            unicode"账户余额不足"
        );
        require(
            amount <= withdrawLimit,
            unicode"超过当前取款限额"
        );

        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);

        records[msg.sender].push(
            Transaction(
                "Withdraw",
                amount,
                msg.sender,
                block.timestamp
            )
        );
    }

    // 转账
    function transferTo(address to, uint amount) public {
        require(to != address(0), "Invalid address");
        require(amount > 0, "Invalid amount");
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;
        balances[to] += amount;

        records[msg.sender].push(
            Transaction(
                "Transfer",
                amount,
                to,
                block.timestamp
            )
        );
    }

    // 设置限额
    function setWithdrawLimit(uint limit) public onlyAdmin {
        withdrawLimit = limit;
    }

    // 查看当前限额
    function getWithdrawLimit() public view returns (uint) {
        return withdrawLimit;
    }

    // 查看交易数量
    function getTransactionCount() public view returns (uint) {
        return records[msg.sender].length;
    }

    // 查看交易记录
    function getTransaction(uint index)
        public
        view
        returns (
            string memory,
            uint,
            address,
            uint
        )
    {
        require(
            index < records[msg.sender].length,
            "Transaction index out of bounds"
        );

        Transaction memory txRecord =
            records[msg.sender][index];

        return (
            txRecord.txType,
            txRecord.amount,
            txRecord.target,
            txRecord.timestamp
        );
    }
}