"use client";

import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';

// 提醒：部署到测试网（如 Sepolia）后请更新此地址
const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; 

// 使用 Human-Readable ABI，更简洁且易于在 Vercel 环境下维护
const ABI =  [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tokensIssued",
          "type": "uint256"
        }
      ],
      "name": "Deposit",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "domain",
          "type": "string"
        }
      ],
      "name": "DomainRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "domain",
          "type": "string"
        }
      ],
      "name": "DomainTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Withdraw",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "DOMAIN_COST",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "TOKEN_PER_ETH",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "addressToDomain",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "bankName",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "bankOwner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "domainToAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "ethBalances",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "getAccountInfo",
      "outputs": [
        {
          "internalType": "string",
          "name": "domain",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "ethBal",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "tokenBal",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_domain",
          "type": "string"
        }
      ],
      "name": "registerDomain",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "tokenBalances",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_receiver",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_domain",
          "type": "string"
        }
      ],
      "name": "transferDomain",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_receiver",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "transferToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdrawBankFees",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

export function useYuan() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({ 
    domain: "", 
    ethBalance: "0.0", 
    tokenBalance: "0", 
    bankName: "YUAN BANK" 
  });

  // 1. 获取合约数据的核心函数
  const fetchContractData = useCallback(async (userAddress) => {
    if (!window.ethereum || !userAddress) return;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      
      // 预检：确保当前网络在该地址有合约代码
      const code = await provider.getCode(CONTRACT_ADDRESS);
      if (code === "0x") {
        console.warn("Contract not found at address. Check your network.");
        return;
      }

      const [name, accountInfo] = await Promise.all([
        contract.bankName().catch(() => "YUAN BANK"),
        contract.getAccountInfo(userAddress)
      ]);

      setInfo({
        bankName: name,
        domain: accountInfo.domain || "NONE",
        ethBalance: ethers.formatEther(accountInfo.ethBal),
        tokenBalance: accountInfo.tokenBal.toString()
      });
    } catch (err) {
      console.error("Fetch Data Error:", err);
    }
  }, []);

  // 2. 连接钱包
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      await fetchContractData(accounts[0]);
    } catch (err) {
      if (err.code === 4001) console.log("User rejected connection.");
      else console.error("Connection Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. 退出登录 (UI 层面的断开)
  const disconnect = useCallback(() => {
    setAccount(null);
    setInfo({ 
      domain: "", 
      ethBalance: "0.0", 
      tokenBalance: "0", 
      bankName: "YUAN BANK" 
    });
    console.log("Disconnected from dApp");
  }, []);

  // 4. 通用交易处理器
  const handleTransaction = async (txPromise) => {
    setLoading(true);
    try {
      const tx = await txPromise;
      await tx.wait();
      await fetchContractData(account);
    } catch (err) {
      if (err.code === "ACTION_REJECTED" || err.code === 4001) {
        console.log("Transaction rejected by user.");
      } else {
        console.error("Transaction Error:", err);
        alert("Transaction failed. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 5. 业务功能集
  const deposit = (amount) => {
    if (!amount || isNaN(amount)) return alert("Invalid amount");
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider.getSigner().then(signer => {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      return handleTransaction(contract.deposit({ value: ethers.parseEther(amount) }));
    });
  };

  const withdraw = (amount) => {
    if (!amount || isNaN(amount)) return alert("Invalid amount");
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider.getSigner().then(signer => {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      return handleTransaction(contract.withdraw(ethers.parseEther(amount)));
    });
  };

  const register = (domainName) => {
    if (!domainName) return alert("Enter a domain name");
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider.getSigner().then(async (signer) => {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const cost = await contract.DOMAIN_COST();
      return handleTransaction(contract.registerDomain(domainName, { value: cost }));
    });
  };

  const transferToken = (toAddress, amount) => {
    if (!toAddress || !ethers.isAddress(toAddress)) return alert("Invalid recipient address");
    if (!amount || isNaN(amount)) return alert("Invalid amount");
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider.getSigner().then(signer => {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      return handleTransaction(contract.transferToken(toAddress, amount));
    });
  };

  // 6. 生命周期与自动重连
  useEffect(() => {
    if (!window.ethereum) return;

    // 页面刷新时，如果钱包已授权，则自动加载数据
    const autoConnect = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        const addr = accounts[0].address;
        setAccount(addr);
        fetchContractData(addr);
      }
    };
    autoConnect();

    // 监听账户切换
    const handleAccounts = (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        fetchContractData(accounts[0]);
      } else {
        disconnect(); // 钱包内手动断开时触发
      }
    };

    // 监听链切换 (强制刷新以防数据不一致)
    const handleChain = () => window.location.reload();

    window.ethereum.on('accountsChanged', handleAccounts);
    window.ethereum.on('chainChanged', handleChain);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccounts);
      window.ethereum.removeListener('chainChanged', handleChain);
    };
  }, [fetchContractData, disconnect]);

  return { 
    account, 
    info, 
    loading, 
    connectWallet, 
    disconnect, 
    deposit, 
    withdraw, 
    register, 
    transferToken 
  };
}