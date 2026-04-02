import { ethers } from "ethers";
import fs from "fs";
import path from "path";

async function main() {
  console.log("--- 启动手动部署模式 ---");

  // 1. 连接到你正在运行的 npx hardhat node
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  
  // 2. 获取本地节点的第一个账户作为部署者
  const signer = await provider.getSigner();
  console.log("部署账户:", await signer.getAddress());

  // 3. 手动读取 Hardhat 编译生成的 ABI 和 Bytecode
  // 注意：如果你的合约文件名不是 YuanCombined，请修改下面的路径
  const artifactPath = path.resolve("./artifacts/contracts/YuanCombined.sol/YuanCombined.json");
  
  if (!fs.existsSync(artifactPath)) {
    throw new Error("找不到编译文件，请先运行 npx hardhat compile");
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  console.log("正在部署 YuanCombined 合约...");

  // 4. 创建合约工厂并部署
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
  const contract = await factory.deploy();

  // 5. 等待部署完成 (ethers v6 语法)
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("-----------------------------------------------");
  console.log(`✅ 部署成功！`);
  console.log(`合约地址: ${address}`);
  console.log("-----------------------------------------------");
}

main().catch((error) => {
  console.error("部署失败:", error);
  process.exit(1);
});