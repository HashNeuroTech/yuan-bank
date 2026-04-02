import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "YUAN BANK | 去中心化银行与身份",
  description: "基于 ActivityPub 的去中心化金融身份平台",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="zh-CN"
      // 这里的 h-full 是为了确保渐变背景能撑满屏幕
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col selection:bg-yellow-500/30">
        {children}
      </body>
    </html>
  );
}