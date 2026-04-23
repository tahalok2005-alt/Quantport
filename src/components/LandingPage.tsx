import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, LineChart, Info, AlertCircle, Loader2, Settings2, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

interface Asset {
  ticker: string;
  quantity: number;
}

interface LandingPageProps {
  onRun: (config: any) => void;
  isLoading: boolean;
  error: string | null;
}

export default function LandingPage({ onRun, isLoading, error }: LandingPageProps) {
  const [assets, setAssets] = useState<Asset[]>([{ ticker: '', quantity: 1 }]);
  const [benchmark, setBenchmark] = useState('^NSEI');
  const [riskFreeRate, setRiskFreeRate] = useState(5.0);
  const [period, setPeriod] = useState('1y');

  const addAsset = () => setAssets([...assets, { ticker: '', quantity: 1 }]);
  const removeAsset = (index: number) => setAssets(assets.filter((_, i) => i !== index));
  const updateAsset = (index: number, field: keyof Asset, value: string | number) => {
    const newAssets = [...assets];
    newAssets[index] = { ...newAssets[index], [field]: value };
    setAssets(newAssets);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validAssets = assets.filter(a => a.ticker.trim() !== '');
    if (validAssets.length === 0) return;
    onRun({ assets: validAssets, benchmark, riskFreeRate, period });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-[#0B0F19] text-[#E2E8F0]">
      {/* Immersive Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-10 w-full max-w-5xl"
      >
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black tracking-[0.2em] mb-8 uppercase">
            <LineChart className="w-3 h-3" />
            Strategic Intelligence Platform
          </div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 uppercase">
            Quantum <span className="text-sky-400 italic">Terminal</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Execute professional-grade portfolio analytics. 
            Calibrate your risk, optimize your Alpha, and simulate future market regimes.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Input Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-8 border-white/5 relative group">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_#38BDF8]"></div>
                  Asset Inventory
                </h2>
                <button
                  type="button"
                  onClick={addAsset}
                  className="text-[10px] font-bold flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors uppercase tracking-widest"
                >
                  <Plus className="w-3.5 h-3.5" /> Append Asset
                </button>
              </div>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {assets.map((asset, index) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={index} 
                    className="flex gap-4 items-center group/row"
                  >
                    <div className="flex-1 relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-600 tracking-tighter">TKR:</div>
                      <input
                        type="text"
                        placeholder="RELIANCE.NS"
                        value={asset.ticker}
                        onChange={(e) => updateAsset(index, 'ticker', e.target.value.toUpperCase())}
                        className="w-full bg-black/40 border border-white/5 rounded-lg pl-12 pr-4 py-3 text-sm font-mono focus:outline-none focus:border-sky-500/50 focus:bg-black/60 transition-all text-white placeholder:text-gray-700"
                        required
                      />
                    </div>
                    <div className="w-32 relative text-right">
                       <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-600 tracking-tighter">QTY:</div>
                       <input
                        type="number"
                        placeholder="0"
                        value={asset.quantity}
                        onChange={(e) => updateAsset(index, 'quantity', parseFloat(e.target.value))}
                        className="w-full bg-black/40 border border-white/5 rounded-lg pl-12 pr-4 py-3 text-sm font-mono focus:outline-none focus:border-sky-500/50 focus:bg-black/60 transition-all text-white placeholder:text-gray-700"
                        min="0.1"
                        step="any"
                        required
                      />
                    </div>
                    {assets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAsset(index)}
                        className="p-3 text-gray-600 hover:text-rose-400 hover:bg-rose-500/5 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-5 bg-rose-500/5 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-bold leading-relaxed"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                SYSTEM ERROR: {error}
              </motion.div>
            )}
          </div>

          {/* Configuration Card */}
          <div className="space-y-6">
            <div className="glass-card p-8 border-white/5 flex flex-col h-full">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                <Settings2 className="w-4 h-4" />
                Parameters
              </h2>
              
              <div className="space-y-6 flex-1">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Benchmark Domain</label>
                  <select 
                    value={benchmark}
                    onChange={(e) => setBenchmark(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-sky-500/50 appearance-none cursor-pointer"
                  >
                    <option value="^NSEI">NIFTY 50 (IND)</option>
                    <option value="^BSESN">SENSEX (IND)</option>
                    <option value="^GSPC">S&P 500 (USA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Risk-Free Yield (%)</label>
                  <input 
                    type="number"
                    value={riskFreeRate}
                    onChange={(e) => setRiskFreeRate(parseFloat(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:border-sky-500/50"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Analytics Window</label>
                  <select 
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-sky-500/50 appearance-none cursor-pointer"
                  >
                    <option value="3m">3 Months (T-90)</option>
                    <option value="6m">6 Months (H1)</option>
                    <option value="1y">1 Year (Standard)</option>
                    <option value="2y">2 Years (Bi-Annual)</option>
                    <option value="3y">3 Years (LTD)</option>
                    <option value="5y">5 Years (Cycle)</option>
                  </select>
                </div>
              </div>

              <div className="mt-12">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative py-4 bg-sky-600 hover:bg-sky-500 rounded-xl font-black text-xs text-white uppercase tracking-[0.3em] shadow-lg shadow-sky-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale group"
                >
                  <span className="flex items-center justify-center gap-3">
                    {isLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> EXECUTING...</>
                    ) : (
                      <>INITIATE ANALYSIS <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>

      <div className="mt-16 flex items-center gap-4 text-gray-700 text-[10px] font-black uppercase tracking-[0.4em]">
        <div className="h-[1px] w-12 bg-gray-800"></div>
        End Transmission
        <div className="h-[1px] w-12 bg-gray-800"></div>
      </div>
    </div>
  );
}

