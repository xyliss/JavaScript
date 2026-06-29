# DApp Bank 去中心化银行系统

## 📖 项目简介

DApp Bank 是一个基于区块链技术开发的去中心化银行管理系统，旨在模拟传统银行的核心业务流程。项目以 Solidity 智能合约为核心，结合Hardhat、Ethers.js、MetaMask 以及 JavaScript 前端技术实现链上资金管理与交互功能

系统支持用户进行存款、取款、转账、余额查询以及交易记录查看，同时管理员可以设置全局取款限额，实现基础权限管理与资金安全控制

---

## 🚀 功能特点

### 用户功能

* 钱包连接（MetaMask）
* 查询账户余额
* 存款（Deposit）
* 取款（Withdraw）
* 转账（Transfer）
* 查看交易记录
* 自动恢复钱包连接状态

### 管理员功能

* 设置取款限额
* 查看当前取款限额

---

## 🛠 技术栈

### 智能合约层

* Solidity
* Hardhat

### 前端交互层

* JavaScript
* Ethers.js
* MetaMask

### 页面展示层

* HTML5
* CSS3

---

## 📂 项目结构

```text
DApp-Bank/
├── contracts/        # 智能合约代码
├── scripts/          # 合约部署脚本
├── artifacts/        # 编译生成文件
├── frontend/         # 前端页面代码
├── test/             # 测试文件
├── hardhat.config.js # Hardhat 配置文件
└── package.json      # 项目依赖配置
```

---

## ⚙️ 安装与运行

### 1. 安装依赖

```bash
npm install
```

### 2. 编译合约

```bash
npx hardhat compile
```

### 3. 启动本地区块链

```bash
npx hardhat node
```

### 4. 部署合约

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 5. 启动前端页面

直接打开：

```text
frontend/index.html
```

---

## 🔐 核心功能逻辑

### 存款逻辑

用户输入 ETH 金额后，调用智能合约 `deposit()` 方法完成链上存款，并更新账户余额与交易记录

### 取款逻辑

用户发起取款请求时，系统会校验：

* 金额是否合法
* 余额是否充足
* 是否超过管理员设定限额

校验通过后完成转账并更新记录

### 转账逻辑

用户可向其他地址转账，系统同步更新发送方与接收方余额，并记录交易信息

### 管理员逻辑

管理员拥有修改全局取款限额的权限，用于控制单次取款最大金额。

---

## 📌 项目目标

* 学习 Solidity 智能合约开发
* 熟悉 Hardhat 开发流程
* 掌握 Ethers.js 链上交互
* 理解 MetaMask 钱包连接机制
* 实践 Web3 DApp 开发流程

---

## 📈 后续优化方向

* 增加用户身份认证
* 增加贷款与利息计算功能
* 支持 ERC-20 Token
* 部署到测试网（Sepolia）
* 优化前端界面与用户体验

---