const hre = require("hardhat");
async function main() {
  // 获取合约工厂
  const Counter = await hre.ethers.getContractFactory("Counter");
  // 部署合约
  const counter = await Counter.deploy();
  // 等待部署完成
  await counter.waitForDeployment();
  // 获取部署后的合约地址
  const address = await counter.getAddress();
  console.log("Counter 合约部署到:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
