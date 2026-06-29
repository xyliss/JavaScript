const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const abi = [
    "function getTransactionCount() view returns(uint)",
    "function getTransaction(uint index) view returns(string,uint,address,uint)"
];

let provider;
let signer;
let contract;

window.onload = async function () {
    provider = new ethers.BrowserProvider(window.ethereum);

    signer = await provider.getSigner();

    contract = new ethers.Contract(
        contractAddress,
        abi,
        signer
    );

    loadAllTransactions();
};

async function loadAllTransactions() {
    const count = await contract.getTransactionCount();

    const txList =
        document.getElementById("allTxList");

    txList.innerHTML = "";

    for (let i = 0; i < count; i++) {
        const tx = await contract.getTransaction(i);

        const li = document.createElement("li");

        let typeCN = "";
        let amountText = "";

        if (tx[0] === "Deposit") {
            typeCN = "存款";
            amountText =
                "+" + ethers.formatEther(tx[1]) + " ETH";
        } else if (tx[0] === "Withdraw") {
            typeCN = "取款";
            amountText =
                "-" + ethers.formatEther(tx[1]) + " ETH";
        } else {
            typeCN = "转账";
            amountText =
                "-" + ethers.formatEther(tx[1]) + " ETH";
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
    }
}

function goBack() {
    window.location.href = "index.html";
}