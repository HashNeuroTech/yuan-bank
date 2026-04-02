import "@nomicfoundation/hardhat-ethers"; // 这一行是生命线，它负责给 hre 注入 ethers

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
};