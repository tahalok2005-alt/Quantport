import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, ShieldAlert, Sparkles, PieChart, 
  TrendingUp, Settings2, CloudRain, Info, 
  ArrowLeft, ExternalLink, TrendingDown
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, ScatterChart, Scatter, ZAxis, Cell
} from 'recharts';
import { cn } from '../lib/utils';

interface DashboardProps {
  data: any;
  onReset: () => void;
}

const TABS = [
  { id: 'overview', name: 'Overview', icon: BarChart3 },
  { id: 'risk', name: 'Risk', icon: ShieldAlert },
  { id: 'improve', name: 'Improve My Portfolio', icon: Sparkles },
  { id: 'diversification', name: 'Diversification', icon: PieChart },
  { id: 'future', name: 'Future Scenarios', icon: TrendingUp },
  { id: 'smart', name: 'Smart Allocation', icon: Settings2 },
  { id: 'market', name: 'Market Conditions', icon: CloudRain },
];

export default function Dashboard({ data, onReset }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab data={data.overview} market={data.market} />;
      case 'risk': return <RiskTab data={data.risk} />;
      case 'improve': return <ImproveTab data={data.efficientFrontier} />;
      case 'diversification': return <DiversificationTab data={data.diversification} />;
      case 'future': return <FutureTab data={data.monteCarlo} />;
      case 'smart': return <SmartTab data={data.smartAllocation} />;
      case 'market': return <MarketTab data={data.market} />;
      default: return <OverviewTab data={data.overview} market={data.market} />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0B0F19] text-[#E2E8F0] overflow-hidden">
      {/* Terminal Header */}
      <header className="terminal-header flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onReset}
            className="group bg-sky-500 w-8 h-8 rounded flex items-center justify-center font-bold text-white hover:bg-sky-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="bg-sky-600/20 w-8 h-8 rounded flex items-center justify-center font-bold text-sky-400 border border-sky-500/30">Q</div>
          <h1 className="text-lg font-semibold tracking-tight uppercase">Quantum <span className="text-sky-400 font-normal">Terminal</span></h1>
          <div className="h-4 w-[1px] bg-gray-700 mx-2"></div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10B981]"></div>
            LIVE: QUANT_PORT_ANALYSIS • {new Date().toLocaleTimeString()} <span className="text-emerald-400">+0.82%</span>
          </div>
        </div>
        <div className="flex items-center gap-6 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
          <span className="flex items-center gap-1.5"><ShieldAlert className="w-3 h-3"/> Tier: Institutional</span>
          <span className="flex items-center gap-1.5"><Settings2 className="w-3 h-3"/> Session: ACTIVE</span>
        </div>
      </header>

      {/* Navigation Sub-header */}
      <nav className="flex bg-[#0D121F] border-b border-white/5 px-6 shrink-0">
        <div className="flex gap-8 text-[11px] font-bold uppercase tracking-wider h-12 items-center">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "h-full flex items-center gap-2 transition-all border-b-2 decoration-none",
                activeTab === tab.id 
                  ? "border-sky-400 text-sky-400" 
                  : "border-transparent text-gray-500 hover:text-gray-300"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.name}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[280px] border-r border-white/5 bg-[#0D121F] p-6 flex flex-col gap-8 shrink-0 overflow-y-auto no-scrollbar">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-4 block">Current Strategy</label>
            <div className="bg-sky-400/5 p-4 rounded-xl border border-sky-400/20">
               <div className="flex items-center justify-between mb-2">
                 <span className="text-xs font-bold text-sky-400">Risk Profile</span>
                 <span className="text-[10px] bg-sky-400/20 text-sky-400 px-1.5 py-0.5 rounded">MODERATE</span>
               </div>
               <p className="text-[11px] text-slate-400 leading-relaxed">
                 Targeting Alpha through cross-sector diversification with CAPM-aligned Beta positioning.
               </p>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-4 block">Portfolio Exposure</label>
            <div className="flex flex-col gap-3">
              {data.smartAllocation.currentWeights.map((w: any) => (
                <div key={w.name} className="bg-slate-800/20 p-3 rounded-lg border border-white/5 flex justify-between items-center group hover:bg-white/5 transition-colors">
                  <span className="text-xs font-semibold">{w.name}</span>
                  <span className="text-xs font-mono text-sky-400">{(w.weight * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto">
             <div className="p-4 glass-card border-amber-900/30 bg-amber-950/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                 <CloudRain className="w-12 h-12" />
               </div>
               <h4 className="text-xs font-bold text-amber-400 uppercase mb-2 flex items-center gap-2">
                 <ShieldAlert className="w-3 h-3" />
                 Market Pulse
               </h4>
               <p className="text-[11px] leading-relaxed text-amber-100/70">
                 System indicates a <strong>{data.market.regime}</strong> state. 
                 {data.market.regime === 'Highly Volatile' ? ' Consider hedging current positions.' : ' Monitor sector correlations closely.'}
               </p>
             </div>
          </div>
        </aside>

        {/* Dashboard Content Area */}
        <section className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-[#0B0F19]">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("glass-card p-6", className)}>
      {children}
    </div>
  );
}

function SectionInfo({ title, explanation, interpretation }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <Card className="border-l-4 border-l-sky-500 bg-sky-500/5">
        <h4 className="text-xs font-bold text-sky-400 uppercase mb-3 flex items-center gap-2">
          <span>💡</span> Strategic Insight
        </h4>
        <p className="text-sm leading-relaxed text-slate-300 italic">"{interpretation}"</p>
      </Card>
      
      <Card className="bg-slate-900/40">
        <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Institutional Briefing</h4>
        <p className="text-xs leading-relaxed text-slate-400 mb-4">{explanation}</p>
        <div className="bg-black/30 p-3 rounded border border-white/5">
          <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Impact Analysis:</p>
          <p className="text-[11px] text-sky-400/80 italic">Optimized modeling helps decouple emotional bias from execution.</p>
        </div>
      </Card>
    </div>
  );
}

function KPICard({ title, value, sub, isPercent = false, trend }: any) {
  return (
    <Card className="flex flex-col justify-between py-5">
      <span className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-bold mb-2">{title}</span>
      <div className="flex items-baseline gap-2">
        <h3 className={cn(
          "text-3xl font-bold font-mono tracking-tighter glow-blue",
          trend !== undefined && trend > 0 ? "text-emerald-400" : trend !== undefined && trend < 0 ? "text-rose-400" : "text-white"
        )}>
          {isPercent ? `${(value * 100).toFixed(2)}%` : value.toFixed(2)}
        </h3>
        {trend !== undefined && (
          <span className={cn("text-xs font-bold", trend >= 0 ? "text-emerald-500" : "text-rose-500")}>
            {trend >= 0 ? '↑' : '↓'}
          </span>
        )}
      </div>
      <div className="text-[10px] text-gray-500 mt-2 font-medium tracking-wide">{sub}</div>
    </Card>
  );
}

// --- TAB COMPONENTS ---

function OverviewTab({ data, market }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Portfolio Return" value={data.portfolioReturn} isPercent sub="Net asset performance" trend={data.portfolioReturn} />
        <KPICard title="Benchmark Return" value={data.benchmarkReturn} isPercent sub="Market tracking accuracy" trend={data.benchmarkReturn} />
        <KPICard title="Excess Alpha" value={data.alpha} sub="Model-driven outperformance" trend={data.alpha} />
        <KPICard title="Portfolio Beta" value={data.beta} sub="Systematic risk sensitivity" />
      </div>

      <Card className="h-[450px] relative overflow-hidden group">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-3">
             <div className="w-1.5 h-6 bg-sky-500 rounded-full"></div>
             Performance Trajectory vs Benchmark
           </h3>
           <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest">
             <div className="flex items-center gap-2 text-sky-400"><div className="w-2.5 h-2.5 rounded-full bg-sky-500"></div> Portfolio</div>
             <div className="flex items-center gap-2 text-gray-500"><div className="w-2.5 h-2.5 rounded bg-gray-600"></div> Benchmark</div>
           </div>
        </div>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={data.chartData}>
            <defs>
              <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
            <XAxis dataKey="date" stroke="#4B5563" fontSize={9} minTickGap={60} axisLine={false} tickLine={false} />
            <YAxis stroke="#4B5563" fontSize={9} domain={['auto', 'auto']} axisLine={false} tickLine={false} tickFormatter={(val) => `${((val-1)*100).toFixed(0)}%`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '12px', fontSize: '10px' }}
              itemStyle={{ fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="portfolio" stroke="#38BDF8" strokeWidth={3} fillOpacity={1} fill="url(#colorPortfolio)" name="Portfolio" />
            <Line type="monotone" dataKey="benchmark" stroke="#4B5563" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Benchmark" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <SectionInfo 
        explanation="The Capital Asset Pricing Model (CAPM) explains the relationship between systematic risk and expected return. Beta measures how volatile you are relative to index movements."
        interpretation={data.portfolioReturn > data.benchmarkReturn 
          ? "Strategic outperformance detected. Your selection process is generating significant Alpha. However, note your Beta position indicates sensitivity to broader market corrections."
          : "Underperformance relative to benchmark. Analysis suggests current allocation is structurally misaligned with the driving factors of the benchmark index."
        }
      />
    </div>
  );
}

function RiskTab({ data }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Ann. Volatility" value={data.volatility} isPercent sub="Return predictability coefficient" />
        <KPICard title="Sharpe Ratio" value={data.sharpe} sub="Risk-adjusted return efficiency" />
        <KPICard title="Max Drawdown" value={data.maxDrawdown} isPercent sub="Peak-to-trough stress test" trend={-1} />
        <KPICard title="VaR (95%)" value={data.var95} isPercent sub="Probabilistic downside limit" trend={-1} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 h-[350px]">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-pink-500/80 mb-8 flex items-center gap-3">
             <div className="w-1.5 h-6 bg-pink-500 rounded-full"></div>
             Drawdown Profile Analysis
          </h3>
          <ResponsiveContainer width="100%" height="75%">
             <AreaChart data={data.drawdownChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="date" stroke="#4B5563" fontSize={9} minTickGap={60} hide />
                <YAxis stroke="#4B5563" fontSize={9} domain={['auto', 0]} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="drawdown" stroke="#F43F5E" fill="#F43F5E22" strokeWidth={2} />
             </AreaChart>
          </ResponsiveContainer>
        </Card>
        
        <Card className="flex flex-col items-center justify-center text-center bg-sky-500/[0.02]">
           <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="#1F2937" strokeWidth="8" fill="transparent" />
                <circle cx="80" cy="80" r="70" stroke="#38BDF8" strokeWidth="8" fill="transparent" 
                        strokeDasharray={440} 
                        strokeDashoffset={440 - (Math.min(data.sharpe / 3, 1) * 440)}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-mono font-bold text-white tracking-tighter">{data.sharpe.toFixed(2)}</span>
                <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest mt-1">Sharpe Factor</span>
              </div>
           </div>
        </Card>
      </div>

      <SectionInfo 
        explanation="The Sharpe Ratio evaluates if returns are due to intelligent allocation or excessive leverage. VaR (Value at Risk) estimates the maximum potential loss over a specific time frame at a 95% confidence level."
        interpretation={data.maxDrawdown > 0.2 
          ? "Excessive drawdown detected (above 20%). The current volatility profile suggests a high probability of structural capital erosion during bearish regimes. Hedging is strongly advised."
          : "Resilient risk architecture. Portfolio maintain stability during market turbulence, indicating effective asset correlation management."
        }
      />
    </div>
  );
}

function ImproveTab({ data }: any) {
  return (
    <div className="space-y-6">
      <Card className="h-[550px]">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-3">
             <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
             Efficient Frontier Optimization
           </h3>
           <div className="text-[10px] text-gray-500 font-black tracking-[0.2em] uppercase">MPT Model Integration</div>
        </div>
        <ResponsiveContainer width="100%" height="80%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
            <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" vertical={false} />
            <XAxis type="number" dataKey="volatility" name="Risk" unit="%" stroke="#4B5563" fontSize={9} domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} />
            <YAxis type="number" dataKey="return" name="Return" unit="%" stroke="#4B5563" fontSize={9} domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} />
            <ZAxis type="number" range={[15, 15]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3', stroke: '#38BDF8' }} 
              contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937', color: '#E2E8F0' }} 
            />
            <Scatter name="Efficient Cloud" data={data.portfolios.map((p: any) => ({ ...p, return: p.return * 100, volatility: p.volatility * 100 }))} fill="#38BDF811" />
            <Scatter 
              name="Active Profile" 
              data={[{ return: data.current.return * 100, volatility: data.current.volatility * 100 }]} 
              fill="#FACC15" 
            />
          </ScatterChart>
        </ResponsiveContainer>
      </Card>

      <SectionInfo 
        explanation="Modern Portfolio Theory identifies 'The Efficient Frontier'—a theoretical set of optimal portfolios that offer the highest expected return for a defined level of risk."
        interpretation="Your current allocation (highlighted) resides within the efficiency sub-curve. To optimize, you could rebalance toward the upper boundary to increase expected yield without scaling the risk coefficient."
      />
    </div>
  );
}

function DiversificationTab({ data }: any) {
  const tickers = data.correlationMatrix.map((r: any) => r.name);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <Card className="xl:col-span-3">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-sky-400 flex items-center gap-3">
               <div className="w-1.5 h-6 bg-sky-500 rounded-full"></div>
               Asset Correlation Grid
            </h3>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex flex-col gap-1 min-w-[500px]">
               <div className="flex">
                 <div className="w-20 text-[9px] font-black text-gray-600 uppercase" />
                 {tickers.map((t: string) => (
                   <div key={t} className="flex-1 text-[9px] text-center font-black text-gray-500 uppercase tracking-widest">{t}</div>
                 ))}
               </div>
               {data.correlationMatrix.map((row: any) => (
                 <div key={row.name} className="flex items-center gap-1">
                   <div className="w-20 text-[9px] font-black text-gray-400 uppercase tracking-tighter truncate">{row.name}</div>
                   {tickers.map((t: string) => {
                     const val = row[t];
                     const intensity = Math.abs(val);
                     const bgColor = val > 0.7 ? '#F43F5E' : val > 0.4 ? '#F97316' : val > 0 ? '#10B981' : '#38BDF8';
                     return (
                       <div 
                        key={t}
                        style={{ backgroundColor: bgColor, opacity: intensity > 0.3 ? intensity : 0.2 }}
                        className="flex-1 h-10 rounded-sm flex items-center justify-center text-[10px] font-mono font-bold text-white border border-white/5"
                       >
                         {val.toFixed(2)}
                       </div>
                     )
                   })}
                 </div>
               ))}
            </div>
          </div>
        </Card>

        <Card className="xl:col-span-2">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-8">Risk Contribution Vector</h3>
           <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data.riskContribution} layout="vertical" margin={{ right: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#4B5563" fontSize={9} width={70} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937' }} />
                <Bar dataKey="contribution" fill="#38BDF8" radius={[0, 4, 4, 0]} />
              </BarChart>
           </ResponsiveContainer>
        </Card>
      </div>

      <SectionInfo 
        explanation="Correlation coefficients provide insight into systemic risk integration. Assets with high correlation (>0.7) respond identically to shocks, reducing effective diversification."
        interpretation="High concentration detected in highly correlated clusters. A market-wide shock to this sector will bypass traditional stop-losses. We recommend introducing counter-cyclical assets."
      />
    </div>
  );
}

function FutureTab({ data }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="Max Optimistic (95%)" value={data.best} sub="High-growth outcome projection" trend={1} />
        <KPICard title="Expected Value (Median)" value={data.median} sub="Probabilistic center gravity" />
        <KPICard title="Stress Scenario (5%)" value={data.worst} sub="Liquidity crisis simulation" trend={-1} />
      </div>

      <Card className="h-[450px]">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-purple-400 flex items-center gap-3">
             <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
             Monte Carlo Probabilistic Density
           </h3>
           <div className="text-[10px] text-gray-500 font-black tracking-[0.2em] uppercase">1,024 Iterations</div>
        </div>
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={data.distribution}>
             <defs>
               <linearGradient id="colorMC" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4}/>
                 <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
               </linearGradient>
             </defs>
             <XAxis dataKey="val" fontSize={9} stroke="#4B5563" hide />
             <Tooltip 
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937' }}
                labelFormatter={(v) => `NAV Projection: $${v.toFixed(2)}`}
             />
             <Area type="monotone" dataKey="count" stroke="#A855F7" fillOpacity={1} fill="url(#colorMC)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <SectionInfo 
        explanation="Monte Carlo simulation utilizes stochastic modeling to project a distribution of possible future outcomes based on historical mean and multi-variate variance."
        interpretation="Projected outcomes show a standard Gaussian distribution. The 'Long-Tail' risk is currently contained, but the 5th percentile scenario indicates potential for structural impairment."
      />
    </div>
  );
}

function SmartTab({ data }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-10">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-sky-400 flex items-center gap-3">
             <div className="w-1.5 h-6 bg-sky-500 rounded-full"></div>
             Black-Litterman Strategic Weights
           </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div>
              <p className="text-[9px] font-black text-gray-600 mb-6 uppercase tracking-widest pl-2 border-l-2 border-gray-800">Operational Allocation</p>
              <div className="space-y-6">
                {data.currentWeights.map((w: any) => (
                  <div key={w.name}>
                    <div className="flex justify-between text-[10px] font-black text-gray-400 mb-2 uppercase tracking-tighter">
                      <span>{w.name}</span>
                      <span>{(w.weight * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${w.weight * 100}%` }}
                        className="h-full bg-gray-600/40" 
                       />
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div>
              <p className="text-[9px] font-black text-sky-500 mb-6 uppercase tracking-widest pl-2 border-l-2 border-sky-500/40">Target Optimization Vector</p>
              <div className="space-y-6">
                {data.suggestedWeights.map((w: any) => (
                  <div key={w.name}>
                    <div className="flex justify-between text-[10px] font-black text-sky-400 mb-2 uppercase tracking-tighter">
                      <span>{w.name}</span>
                      <span>{(w.weight * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 bg-sky-500/5 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${w.weight * 100}%` }}
                        className="h-full bg-sky-500 shadow-[0_0_8px_#38BDF8]" 
                       />
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </Card>

      <SectionInfo 
        explanation="The Black-Litterman model integrates historical performance with equilibrium returns. It recalibrates weights based on the confidence of the input views."
        interpretation="Strategic pivot recommended. Reallocating toward the Target Vector could significantly enhance the portfolio's durability coefficient while maintaining yield targets."
      />
    </div>
  );
}

function MarketTab({ data }: any) {
  const getRegimeColor = () => {
    if (data.regime === 'Bull') return 'text-emerald-400';
    if (data.regime === 'Bear') return 'text-rose-500';
    return 'text-amber-400';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
       <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center space-y-12"
       >
         <div className="relative">
           <div className="absolute inset-0 bg-sky-500/10 blur-[60px] rounded-full animate-pulse" />
           <div className="relative inline-block p-8 rounded-full bg-slate-900/50 border border-white/5 shadow-2xl backdrop-blur-xl">
             <CloudRain className={cn("w-20 h-20", getRegimeColor())} />
           </div>
         </div>
         
         <div className="space-y-4">
            <p className="text-gray-600 uppercase font-black tracking-[0.4em] text-[10px] animate-pulse">System Diagnostic: Market State</p>
            <h2 className={cn("text-7xl font-black italic tracking-tighter uppercase", getRegimeColor())}>
              {data.regime}
            </h2>
         </div>
         
         <Card className="max-w-xl mx-auto bg-slate-900/40 border-sky-500/10 hover:border-sky-500/20 transition-colors">
           <p className="text-slate-400 text-sm leading-relaxed italic">
             {data.regime === 'Bull' && "Current environment is characterized by secular momentum and high risk-appetite. Optimization engines suggest maintaining long-bias while monitoring sector over-extension."}
             {data.regime === 'Bear' && "Diagnostic confirms structural weakness in core indexes. Defensive rebalancing and cash-positioning are mandated for capital preservation."}
             {data.regime === 'Highly Volatile' && "Elevated turbulence coefficient detected. Pricing models are exhibiting non-linear behavior. Defensive posture and protective hedging protocol strongly advised."}
           </p>
         </Card>
       </motion.div>
    </div>
  );
}
