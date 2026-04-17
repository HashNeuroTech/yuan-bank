"use client";

import { useState } from 'react';

export default function BankLayout({ 
  info, account, deposit, withdraw, register, transferToken, withdrawBankFees 
}) {
  const [domainInput, setDomainInput] = useState('');
  const [amount, setAmount] = useState('0.1');
  const [recipient, setRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  const formatBalance = (val) => {
    if (!val) return "0.00";
    try {
      return parseFloat(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    } catch { return val; }
  };

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-6">
      {/* 核心数据看板 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-100 rounded-lg bg-slate-50 shadow-sm overflow-hidden">
        <div className="p-6 border-b md:border-b-0 md:border-r border-slate-200">
          <p className="text-[10px] font-mono text-slate-500 uppercase mb-2 font-bold tracking-wider">Vault Balance (ETH)</p>
          <p className="text-3xl font-mono text-black font-medium">{formatBalance(info.ethBalance)}</p>
        </div>
        <div className="p-6 border-b md:border-b-0 md:border-r border-slate-200">
          <p className="text-[10px] font-mono text-slate-500 uppercase mb-2 font-bold tracking-wider">My Token Supply (YUAN)</p>
          <p className="text-3xl font-mono text-amber-500 font-medium">{formatBalance(info.tokenBalance)}</p>
        </div>
        <div className="p-6 bg-white">
          <p className="text-[10px] font-mono text-slate-500 uppercase mb-2 font-bold tracking-wider">Identity (DID)</p>
          <p className="text-xl font-mono text-black truncate">{info.domain ? `${info.domain}.yuan` : "No domain linked"}</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 存取款卡片 */}
        <section className="border border-slate-100 p-6 rounded-lg space-y-6 bg-white shadow-sm">
          <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4 font-bold">Financial Operations</h3>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-slate-50 border border-slate-100 p-3 font-mono text-black focus:outline-none focus:border-amber-400 text-sm rounded-sm" />
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => deposit(amount)} className="bg-black text-white py-3 font-mono text-xs font-bold hover:bg-slate-800 uppercase transition-all">Deposit</button>
            <button onClick={() => withdraw(amount)} className="border border-slate-200 py-3 font-mono text-xs font-bold hover:bg-slate-50 uppercase transition-all">Withdraw</button>
          </div>
        </section>

        {/* 域名卡片 */}
        <section className="border border-slate-100 p-6 rounded-lg space-y-6 bg-white shadow-sm">
          <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4 font-bold">Naming Service</h3>
          <div className="flex">
            <input value={domainInput} onChange={(e) => setDomainInput(e.target.value)} className="flex-1 bg-slate-50 border border-slate-100 p-3 font-mono text-black focus:outline-none focus:border-indigo-400 text-sm rounded-l-sm" placeholder="entity_name" />
            <div className="bg-slate-900 px-4 flex items-center font-mono text-white text-sm rounded-r-sm">.yuan</div>
          </div>
          <button onClick={() => register(domainInput)} disabled={!domainInput || !account} className="w-full bg-indigo-600 text-white py-3 font-mono text-xs font-bold hover:bg-indigo-700 disabled:opacity-30 uppercase transition-all rounded-sm">Execute Registration</button>
        </section>

        {/* 转账卡片 */}
        <section className="border border-slate-100 p-6 rounded-lg space-y-6 bg-white shadow-sm">
          <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4 font-bold">Asset Transfer</h3>
          <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="0x..." className="w-full bg-slate-50 border border-slate-100 p-3 font-mono text-black text-xs focus:border-slate-300 outline-none rounded-sm" />
          <input value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} placeholder="0.0" className="w-full bg-slate-50 border border-slate-100 p-3 font-mono text-black text-xs focus:border-slate-300 outline-none rounded-sm" />
          <button onClick={() => transferToken(recipient, transferAmount)} className="w-full border border-black py-3 font-mono text-xs font-bold hover:bg-black hover:text-white transition-all uppercase rounded-sm">Send YUAN Tokens</button>
        </section>

        {/* 管理员入口 */}
        {account?.toLowerCase() === "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266" && (
          <section className="border border-amber-200 p-6 rounded-lg space-y-6 bg-amber-50 shadow-sm">
            <h3 className="text-xs font-mono text-amber-700 uppercase tracking-widest border-b border-amber-100 pb-4 font-bold">Admin Control</h3>
            <div className="flex justify-between items-center">
              <p className="text-xl font-mono text-amber-900 font-bold tracking-tight">Contract Fee Vault</p>
              <button onClick={withdrawBankFees} className="bg-amber-500 text-white px-6 py-3 font-mono text-[10px] font-bold hover:bg-amber-600 uppercase transition-all shadow-md rounded-sm">Withdraw All Fees</button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}