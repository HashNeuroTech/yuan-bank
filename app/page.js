"use client";

import { useState } from "react";
import Header from "./components/Header";
import BankLayout from "./components/BankLayout";
import Footer from "./components/Footer";
import { useYuan } from "../hooks/useYuan"; // 确保路径正确

export default function Home() {
  // 1. 从 useYuan Hook 中解构所有状态和方法
  // 这里的命名必须与 useYuan.js return 的对象属性名完全对应
  const { 
    account, 
    info, 
    loading, 
    connectWallet, 
    deposit, 
    withdraw, 
    register, 
    transferToken 
  } = useYuan();

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* 2. 顶部导航：传入账户信息和连接函数 */}
      <Header 
        account={account} 
        connectWallet={connectWallet} 
      />

      {/* 3. 中间核心业务区 */}
      <div className="max-w-7xl mx-auto px-6">
        {/* 关键修复点：将所有解构出的方法通过 Props 传给 BankLayout。
            如果 BankLayout 接收不到这些 Props，点击按钮就会报 "is not a function"。
        */}
        <BankLayout 
          info={info} 
          account={account} 
          deposit={deposit}
          withdraw={withdraw}
          register={register}
          transferToken={transferToken}
          // 如果 useYuan 里还有 withdrawBankFees 且你需要用，也可以加上：
          // withdrawBankFees={withdrawBankFees}
        />
      </div>

      {/* 4. 底部：纯英文极简版 */}
      <Footer />

      {/* 全局加载遮罩（可选）：当合约交互正在处理时显示 */}
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-[2px] z-[100] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin" />
            <p className="font-mono text-[10px] font-bold tracking-widest uppercase text-black">
              Processing Transaction...
            </p>
          </div>
        </div>
      )}
    </main>
  );
}