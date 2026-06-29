// 1. 初始化全局变量 & 获取DOM元素
let currentBalance = 12.50; // 初始余额
const balanceEl = document.getElementById('balance');
const messageEl = document.getElementById('message');
const depositInput = document.getElementById('depositAmount');
const depositBtn = document.getElementById('depositBtn');
const withdrawInput = document.getElementById('withdrawAmount');
const withdrawBtn = document.getElementById('withdrawBtn');
const transactionList = document.getElementById('transactionList');

// 2. 时间格式化函数：转换为 年-月-日 时:分
function formatDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
}

// 3. 消息提示函数：区分成功/错误样式
function showMessage(text, type) {
    messageEl.className = type;
    messageEl.innerText = text;
    // 3秒后清空提示
    setTimeout(() => {
        messageEl.innerText = '';
        messageEl.className = '';
    }, 3000);
}

// 4. 新增交易记录（插入到列表最顶部）
function addTransaction(text) {
    const li = document.createElement('li');
    li.innerText = text;
    transactionList.insertBefore(li, transactionList.firstChild);
}

// 5. 存款功能逻辑
depositBtn.addEventListener('click', function() {
    const amount = parseFloat(depositInput.value);
    // 校验金额合法性
    if (isNaN(amount) || amount <= 0) {
        showMessage('请输入大于0的有效金额！', 'error');
        return;
    }
    // 更新余额，保留2位小数
    currentBalance = (currentBalance + amount).toFixed(2);
    balanceEl.innerText = currentBalance;
    // 新增交易记录
    const time = formatDate();
    addTransaction(`存款 +${amount.toFixed(2)} ETH — ${time}`);
    // 成功提示 + 清空输入框
    showMessage('存款成功！', 'success');
    depositInput.value = '';
});

// 6. 取款功能逻辑
withdrawBtn.addEventListener('click', function() {
    const amount = parseFloat(withdrawInput.value);
    // 校验金额合法性
    if (isNaN(amount) || amount <= 0) {
        showMessage('请输入大于0的有效金额！', 'error');
        return;
    }
    // 校验余额是否充足
    if (parseFloat(currentBalance) < amount) {
        showMessage('余额不足，无法完成取款！', 'error');
        return;
    }
    // 更新余额，保留2位小数
    currentBalance = (parseFloat(currentBalance) - amount).toFixed(2);
    balanceEl.innerText = currentBalance;
    // 新增交易记录
    const time = formatDate();
    addTransaction(`取款 -${amount.toFixed(2)} ETH — ${time}`);
    // 成功提示 + 清空输入框
    showMessage('取款成功！', 'success');
    withdrawInput.value = '';
});