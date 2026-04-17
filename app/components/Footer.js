"use client";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-100 bg-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Block */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-lg font-black tracking-[ -0.05em] text-black">
              YUAN BANK™
            </span>
            <p className="mt-2 text-[9px] leading-relaxed text-slate-400 font-mono uppercase tracking-tight">
              Decentralized infrastructure by <br/>
              <span className="text-slate-600">Bedroom Tech Company</span>
            </p>
          </div>

          {/* Links: Protocol */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black text-black uppercase tracking-[0.2em] mb-1">Protocol</span>
            <div className="flex flex-col gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              <a href="#" className="hover:text-black transition-none">Nodes</a>
              <a href="#" className="hover:text-black transition-none">Governance</a>
              <a href="#" className="hover:text-black transition-none">Audits</a>
            </div>
          </div>

          {/* Links: Resources */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black text-black uppercase tracking-[0.2em] mb-1">Resources</span>
            <div className="flex flex-col gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              <a href="#" className="hover:text-black transition-none">Docs</a>
              <a href="#" className="hover:text-black transition-none">GitHub</a>
              <a href="#" className="hover:text-black transition-none">API</a>
            </div>
          </div>

          {/* System Status */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black text-black uppercase tracking-[0.2em] mb-1">Network</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 bg-emerald-500 rounded-full" />
              <span className="text-[9px] font-mono font-bold text-emerald-600 uppercase tracking-tighter">
                Live_Mainnet_01
              </span>
            </div>
            <span className="text-[9px] font-mono text-slate-300 uppercase">Hash: 882_BT_26</span>
          </div>
        </div>

        {/* Bottom Legal Section */}
        <div className="pt-6 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center text-[9px] font-mono font-bold text-slate-300 uppercase tracking-[0.15em]">
          <div className="flex gap-6">
            <span>© 2026 BTC INC.</span>
            <a href="#" className="hover:text-slate-600 transition-none">Terms</a>
            <a href="#" className="hover:text-slate-600 transition-none">Privacy</a>
          </div>
          
          <div className="mt-4 md:mt-0 opacity-50">
             GEN_ID: PROT_V3_SY_09
          </div>
        </div>
      </div>
    </footer>
  );
}