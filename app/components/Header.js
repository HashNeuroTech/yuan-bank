"use client";

export default function Header({ account, connectWallet }) {
  return (
    <nav className="border-b border-slate-100 bg-white/90 sticky top-0 z-50 backdrop-blur-sm">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes coin-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-yuan-spin {
          animation: coin-rotate 8s linear infinite;
        }
      `}} />
      
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="animate-yuan-spin drop-shadow-[0_2px_8px_rgba(255,193,7,0.4)]">
              <svg width="38" height="38" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="brightGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF9E0" />
                    <stop offset="30%" stopColor="#FFD700" />
                    <stop offset="70%" stopColor="#FFB300" />
                    <stop offset="100%" stopColor="#D49900" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="48" fill="url(#brightGold)" stroke="#B8860B" strokeWidth="0.5" />
                <rect x="34" y="34" width="32" height="32" fill="white" stroke="#B8860B" strokeWidth="1.5" />
                <g transform="translate(42, 42) scale(0.16)" fill="#8A5B00">
                  <path d="M50 10C35 10 20 18 10 35C15 32 25 30 35 30C40 25 45 20 50 15C55 20 60 25 65 30C75 30 85 32 90 35C80 18 65 10 50 10Z"/>
                  <path d="M30 40C20 40 10 45 10 55C10 65 20 70 30 70H70C80 70 90 65 90 55C90 45 80 40 70 40H30ZM30 50C33 50 35 53 35 55C35 57 33 60 30 60C27 60 25 57 25 55C25 53 27 50 30 50ZM70 50C73 50 75 53 75 55C75 57 73 60 70 60C67 60 65 57 65 55C65 53 67 50 70 50Z"/>
                  <path d="M35 75C25 75 15 80 15 85V95H85V85C85 80 75 75 65 75H35ZM35 85H65V90H35V85Z"/>
                </g>
                <g fill="#5D4037" style={{ fontSize: '15px', fontWeight: '900', fontFamily: 'serif' }}>
                  <text x="50" y="27" textAnchor="middle">招</text>
                  <text x="50" y="85" textAnchor="middle">财</text>
                  <text x="21" y="56" textAnchor="middle">宝</text>
                  <text x="79" y="56" textAnchor="middle">进</text>
                </g>
              </svg>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="font-mono font-bold tracking-tighter text-black text-xl uppercase leading-none">
              YUAN BANK
            </span>
            <span className="text-[10px] text-slate-400 font-bold mt-1 tracking-widest uppercase">
              Global Decentralized Crypto Bank
            </span>
          </div>
        </div>

        {/* Action */}
        <button 
          onClick={connectWallet}
          className="font-mono text-[10px] border border-black px-4 py-1.5 rounded-sm bg-white text-black hover:bg-black hover:text-white transition-all uppercase tracking-widest font-bold"
        >
          {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "[ Connect Wallet ]"}
        </button>
      </div>
    </nav>
  );
}