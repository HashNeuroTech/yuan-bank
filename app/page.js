"use client";

import { useState } from 'react';
import { useYuan } from '../hooks/useYuan';
import { ethers } from 'ethers';

export default function Home() {
  // 假设你的 useYuan 已经更新了 transferToken, transferDomain, withdrawBankFees 等方法
  const { 
    account, 
    info, 
    loading, 
    connectWallet, 
    deposit, 
    withdraw, 
    register,
    transferToken, // 新增
    withdrawBankFees // 新增
  } = useYuan();

  const [domainInput, setDomainInput] = useState('');
  const [amount, setAmount] = useState('0.1');
  
  // 新增：转账状态
  const [recipient, setRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  // 格式化精度：解决截图里一长串 0 的问题
  const formatBalance = (val) => {
    if (!val) return "0.00";
    // 如果 val 已经是 ethers.formatEther 转换后的字符串，直接截断即可
    // 如果是原始 BigInt，则需要转换
    try {
      return parseFloat(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    } catch {
      return val;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-slate-300 font-sans selection:bg-indigo-500/30">
      {/* 顶部导航 */}
      <nav className="border-b border-slate-800 bg-[#0a0b0d]/90 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-black font-bold text-xs font-mono">¥</div>
            <span className="font-mono font-bold tracking-tighter text-white text-xl uppercase">
              YUAN BANK
            </span>
          </div>
          <button 
            onClick={connectWallet}
            className="font-mono text-[10px] border border-slate-700 px-4 py-1.5 rounded-sm hover:bg-white hover:text-black transition-all uppercase tracking-widest"
          >
            {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "[ Connect Wallet ]"}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* 1. 核心数据看板 (Dashboard) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-800 rounded-sm bg-[#111318]">
          <div className="p-6 border-b md:border-b-0 md:border-r border-slate-800">
            <p className="text-[10px] font-mono text-slate-500 uppercase mb-2">Vault Balance (ETH)</p>
            <p className="text-3xl font-mono text-white font-medium">{formatBalance(info.ethBalance)}</p>
          </div>
          <div className="p-6 border-b md:border-b-0 md:border-r border-slate-800">
            <p className="text-[10px] font-mono text-slate-500 uppercase mb-2">My Token Supply (YUAN)</p>
            <p className="text-3xl font-mono text-yellow-500 font-medium">{formatBalance(info.tokenBalance)}</p>
          </div>
          <div className="p-6">
            <p className="text-[10px] font-mono text-slate-500 uppercase mb-2">Identity (DID)</p>
            <p className="text-xl font-mono text-white truncate">
              {info.domain ? `${info.domain}.yuan` : <span className="text-slate-700 italic">No domain linked</span>}
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 2. 存取款操作 (Bank Operations) */}
          <section className="border border-slate-800 p-6 rounded-sm space-y-6 bg-[#0d0e12]">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-4">Financial Operations</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-slate-500 block mb-2 uppercase">Amount (ETH)</label>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-black border border-slate-800 p-3 font-mono text-white focus:outline-none focus:border-slate-400 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => deposit(amount)}
                  className="bg-white text-black py-3 font-mono text-xs font-bold hover:bg-slate-200 uppercase transition-colors"
                >
                  Deposit
                </button>
                <button 
                  onClick={() => withdraw(amount)}
                  className="border border-slate-700 py-3 font-mono text-xs font-bold hover:bg-slate-800 uppercase transition-colors"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </section>

          {/* 3. 域名注册 (Naming Service) */}
          <section className="border border-slate-800 p-6 rounded-sm space-y-6 bg-[#0d0e12]">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-4">Naming Service</h3>
            
            <div className="space-y-4">
              <div className="relative">
                <label className="text-[10px] font-mono text-slate-500 block mb-2 uppercase">Register Domain</label>
                <div className="flex">
                  <input 
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    className="flex-1 bg-black border border-slate-800 p-3 font-mono text-white focus:outline-none focus:border-slate-400 text-sm"
                    placeholder="entity_name"
                  />
                  <div className="bg-slate-900 border border-l-0 border-slate-800 px-4 flex items-center font-mono text-slate-500 text-sm">.yuan</div>
                </div>
              </div>
              
              <button 
                onClick={() => register(domainInput)}
                disabled={!domainInput || !account}
                className="w-full bg-indigo-600 text-white py-3 font-mono text-xs font-bold hover:bg-indigo-500 disabled:opacity-30 uppercase transition-all"
              >
                Execute Registration (1.0 ETH)
              </button>
            </div>
          </section>

          {/* 4. 新增：代币转账 (Token Transfer) - 补全 SimpleToken 功能 */}
          <section className="border border-slate-800 p-6 rounded-sm space-y-6 bg-[#0d0e12]">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-4">Asset Transfer</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-slate-500 block mb-2 uppercase">Recipient Address</label>
                <input 
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="0x..." 
                  className="w-full bg-black border border-slate-800 p-3 font-mono text-white text-xs focus:border-slate-400 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-500 block mb-2 uppercase">Token Amount (YUAN)</label>
                <input 
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="0.0" 
                  className="w-full bg-black border border-slate-800 p-3 font-mono text-white text-xs focus:border-slate-400 outline-none"
                />
              </div>
              <button 
                onClick={() => transferToken(recipient, transferAmount)}
                className="w-full border border-slate-700 py-3 font-mono text-xs font-bold hover:bg-white hover:text-black transition-all uppercase"
              >
                Send YUAN Tokens
              </button>
            </div>
          </section>

          {/* 5. 新增：管理员控制台 (Admin Only) - 补全 SimpleWallet 抽水功能 */}
          {account?.toLowerCase() === "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266" && (
            <section className="border border-yellow-900/30 p-6 rounded-sm space-y-6 bg-[#1a1610]">
              <h3 className="text-xs font-mono text-yellow-600 uppercase tracking-widest border-b border-yellow-900/30 pb-4">Admin Control (Owner)</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-mono text-slate-500 uppercase">Protocol Revenue</p>
                  <p className="text-xl font-mono text-white font-bold tracking-tight">Contract Vault Balance</p>
                </div>
                <button 
                  onClick={withdrawBankFees}
                  className="bg-yellow-600 text-black px-6 py-3 font-mono text-[10px] font-bold hover:bg-yellow-500 uppercase transition-all shadow-lg shadow-yellow-900/20"
                >
                  Withdraw All Fees
                </button>
              </div>
              <p className="text-[9px] font-mono text-yellow-900/60 uppercase italic text-center">
                * Secure access: This panel is only visible to the protocol deployer
              </p>
            </section>
          )}

        </div>

        {/* 底部信息 */}
        <footer className="pt-12 pb-6 text-[10px] font-mono text-slate-600 flex justify-between items-center border-t border-slate-900 mt-12 uppercase tracking-widest">
          <p>STATUS: MAINNET_READY // NETWORK: HARDHAT_LOCAL</p>
          <p>YUAN_PROTOCOL v1.0.5</p>
        </footer>
      </main>
    </div>
  );
}