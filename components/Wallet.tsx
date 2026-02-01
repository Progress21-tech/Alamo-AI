
import React from 'react';

interface WalletProps {
  coins: number;
  credits: number;
}

const Wallet: React.FC<WalletProps> = ({ coins, credits }) => {
  return (
    <div className="flex gap-3 animate__animated animate__fadeInDown">
      {/* Coin Counter - High Contrast Gold Theme */}
      <div className="flex-1 bg-[#FFD700] rounded-3xl p-4 shadow-xl border-b-4 border-yellow-600 flex items-center gap-3 active:scale-95 transition-transform">
        <div className="w-10 h-10 bg-white/40 rounded-full flex items-center justify-center shadow-inner">
          <span className="text-xl">🪙</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-black text-yellow-900/70 leading-none mb-0.5 tracking-tighter">Eko-Coins</span>
          <span className="text-xl font-black text-yellow-950">{coins}</span>
        </div>
      </div>

      {/* Credit Counter - High Contrast Green Theme */}
      <div className="flex-1 bg-[#008751] rounded-3xl p-4 shadow-xl border-b-4 border-green-900 flex items-center gap-3 active:scale-95 transition-transform">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
          <span className="text-xl">📡</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-black text-green-100/70 leading-none mb-0.5 tracking-tighter">Sachet Data</span>
          <span className="text-xl font-black text-white">₦{credits}</span>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
