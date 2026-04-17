// app/layout.js
import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google'; // Next.js 自带，无需安装

// 配置主字体 (无衬线)
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

// 配置代码/余额字体 (等宽)，增加极简金融感
const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono', // 定义一个 CSS 变量
});

export const metadata = {
  title: 'YUAN BANK | Decentralized Protocol',
  description: 'Global Web3 Banking & Naming Service Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* 1. 移除了 dark 类以匹配你的白底设计 
          2. 应用 Inter 字体，并注入 Mono 变量 
      */}
      <body className={`${inter.className} ${mono.variable} bg-white antialiased`}>
        {children}
      </body>
    </html>
  );
}