const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const abi = [
    "function deposit() payable",
    "function getBalance() view returns(uint)",
    "function withdraw(uint amount)",
    "function transferTo(address to, uint amount)",
    "function getTransactionCount() view returns(uint)",
    "function getTransaction(uint index) view returns(string,uint,address,uint)",
    "function setWithdrawLimit(uint limit)",
    "function getWithdrawLimit() view returns(uint)"
];

let provider;
let signer;
let contract;
let txVisible = false;

// 钱包连接
async function connectWallet() {
    try {
        provider = new ethers.BrowserProvider(window.ethereum);

        await provider.send("eth_requestAccounts", []);

        signer = await provider.getSigner();

        contract = new ethers.Contract(
            contractAddress,
            abi,
            signer
        );

        // 保存连接状态
        localStorage.setItem(
            "walletConnected",
            "true"
        );

        alert("钱包连接成功");

    } catch (error) {
        alert("钱包连接失败");
        console.log(error);
    }
}

// 页面加载自动恢复连接
window.onload = async function () {
    const isConnected =
        localStorage.getItem("walletConnected");

    if (isConnected === "true") {
        try {
            provider =
                new ethers.BrowserProvider(
                    window.ethereum
                );

            signer =
                await provider.getSigner();

            contract =
                new ethers.Contract(
                    contractAddress,
                    abi,
                    signer
                );

            console.log("已自动恢复钱包连接");

        } catch (error) {
            console.log("恢复连接失败");
        }
    }
};

// 查询余额
async function getBalance() {
    try {
        const balance = await contract.getBalance();

        document.getElementById("balance").innerText =
            ethers.formatEther(balance) + " ETH";

    } catch {
        alert("查询余额失败");
    }
}

// 存款
async function deposit() {
    try {
        const amount =
            document.getElementById("depositAmount").value;

        const tx = await contract.deposit({
            value: ethers.parseEther(amount)
        });

        await tx.wait();

        alert("存款成功");

        // 清空输入框
        document.getElementById(
            "depositAmount"
        ).value = "";

        // 自动刷新余额
        getBalance();

    } catch (error) {
        alert("存款失败");
        console.log(error);
    }
}

// 取款
async function withdraw() {
    try {
        const amount =
            document.getElementById("withdrawAmount").value;

        const tx = await contract.withdraw(
            ethers.parseEther(amount)
        );

        await tx.wait();

        alert("取款成功");

        document.getElementById(
            "withdrawAmount"
        ).value = "";

        getBalance();

    } catch (error) {
        let errorMsg =
            error.reason || "未知错误";

        // 英文转中文
        if (errorMsg === "Exceed withdraw limit") {
            errorMsg = "超过当前取款限额";
        } else if (
            errorMsg === "Insufficient balance"
        ) {
            errorMsg = "账户余额不足";
        } else if (
            errorMsg === "Invalid amount"
        ) {
            errorMsg = "输入金额无效";
        }

        alert("取款失败：" + errorMsg);

        console.log(error);
    }
}

// 转账
async function transfer() {
    try {
        const to =
            document.getElementById(
                "transferAddress"
            ).value;

        const amount =
            document.getElementById(
                "transferAmount"
            ).value;

        const tx = await contract.transferTo(
            to,
            ethers.parseEther(amount)
        );

        await tx.wait();

        alert("转账成功");

        document.getElementById(
            "transferAddress"
        ).value = "";

        document.getElementById(
            "transferAmount"
        ).value = "";

        getBalance();

    } catch (error) {
        alert("转账失败");
        console.log(error);
    }
}

// 查看/收起交易记录
async function toggleTransactions() {
    const txList =
        document.getElementById("txList");

    const moreBtn =
        document.getElementById("moreBtn");

    if (txVisible) {
        txList.innerHTML = "";
        moreBtn.style.display = "none";
        txVisible = false;
        return;
    }

    try {
        const count = Number(
            await contract.getTransactionCount()
        );

        txList.innerHTML = "";

        const start =
            count > 5 ? count - 5 : 0;

        for (let i = start; i < count; i++) {
            try {
                const tx =
                    await contract.getTransaction(i);

                const li =
                    document.createElement("li");

                let typeCN = "";
                let amountText = "";

                if (tx[0] === "Deposit") {
                    typeCN = "存款";
                    amountText =
                        "+" +
                        ethers.formatEther(tx[1]) +
                        " ETH";

                } else if (
                    tx[0] === "Withdraw"
                ) {
                    typeCN = "取款";
                    amountText =
                        "-" +
                        ethers.formatEther(tx[1]) +
                        " ETH";

                } else {
                    typeCN = "转账";
                    amountText =
                        "-" +
                        ethers.formatEther(tx[1]) +
                        " ETH";
                }

                const date = new Date(
                    Number(tx[3]) * 1000
                ).toLocaleString();

                li.innerText =
                    "类型：" + typeCN +
                    " | 金额：" + amountText +
                    " | 时间：" + date +
                    " | 地址：" + tx[2];

                txList.appendChild(li);

            } catch (err) {
                console.log(
                    "跳过异常记录：",
                    i
                );
            }
        }

        if (count > 5) {
            moreBtn.style.display =
                "block";
        }

        txVisible = true;

    } catch (error) {
        console.log(error);
        alert("加载交易记录失败");
    }
}

// 跳转全部记录页面
function goToRecords() {
    window.location.href =
        "records.html";
}

// 查看限额
async function getLimit() {
    try {
        const limit =
            await contract.getWithdrawLimit();

        document.getElementById(
            "currentLimit"
        ).innerText =
            ethers.formatEther(limit) +
            " ETH";

    } catch {
        alert("获取限额失败");
    }
}

// 设置限额
async function setLimit() {
    try {
        const limit =
            document.getElementById(
                "newLimit"
            ).value;

        const tx =
            await contract.setWithdrawLimit(
                ethers.parseEther(limit)
            );

        await tx.wait();

        alert("限额设置成功");

        document.getElementById(
            "newLimit"
        ).value = "";

        getLimit();

    } catch (error) {
        alert("限额设置失败");
        console.log(error);
    }
}

// 断开钱包（可选）
function disconnectWallet() {
    localStorage.removeItem(
        "walletConnected"
    );

    alert("钱包已断开连接");
}