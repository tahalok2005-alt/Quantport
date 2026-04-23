import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import YahooFinance from "yahoo-finance2";
const yahooFinance = new YahooFinance();
import { format, subMonths, subYears, startOfDay } from "date-fns";
import * as math from "mathjs";
import * as ss from "simple-statistics";

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.post("/api/analyze", async (req, res) => {
  try {
    const { assets, benchmark, riskFreeRate, period } = req.body;
    // assets: [{ ticker: string, quantity: number }]
    // benchmark: "^NSEI" (NIFTY 50) or "^BSESN" (Sensex)
    // period: "3m" | "6m" | "1y" | "2y" | "3y" | "5y"

    const endDate = new Date();
    let startDate: Date;

    switch (period) {
      case "3m": startDate = subMonths(endDate, 3); break;
      case "6m": startDate = subMonths(endDate, 6); break;
      case "1y": startDate = subYears(endDate, 1); break;
      case "2y": startDate = subYears(endDate, 2); break;
      case "3y": startDate = subYears(endDate, 3); break;
      case "5y": startDate = subYears(endDate, 5); break;
      default: startDate = subYears(endDate, 1);
    }

    const tickers = assets.map((a: any) => a.ticker);
    const allTickers = [...tickers, benchmark];

    // Fetch historical data
    const historicalData: any = {};
    await Promise.all(
      allTickers.map(async (ticker) => {
        try {
          const result = await yahooFinance.historical(ticker, {
            period1: format(startDate, "yyyy-MM-dd"),
            period2: format(endDate, "yyyy-MM-dd"),
            interval: "1d",
          });
          historicalData[ticker] = result;
        } catch (e) {
          console.error(`Error fetching ${ticker}:`, e);
          historicalData[ticker] = [];
        }
      })
    );

    // Initial check
    if (Object.keys(historicalData).some(t => historicalData[t].length === 0)) {
       // Filter out assets with no data or handle error
    }

    // Align dates and calculate returns
    // Find common dates across all tickers
    const dates = historicalData[benchmark].map((d: any) => format(d.date, "yyyy-MM-dd"));
    const commonDates = dates.filter((date: string) => 
      allTickers.every(t => historicalData[t].some((d: any) => format(d.date, "yyyy-MM-dd") === date))
    );

    const assetPrices: any = {};
    const assetReturns: any = {};
    const benchmarkReturns: number[] = [];

    allTickers.forEach(ticker => {
      assetPrices[ticker] = commonDates.map((date: string) => {
        const d = historicalData[ticker].find((item: any) => format(item.date, "yyyy-MM-dd") === date);
        return d.adjClose || d.close || d.open || 0;
      });
      
      const returns: number[] = [];
      for (let i = 1; i < assetPrices[ticker].length; i++) {
        returns.push((assetPrices[ticker][i] - assetPrices[ticker][i - 1]) / assetPrices[ticker][i - 1]);
      }
      assetReturns[ticker] = returns;
      if (ticker === benchmark) benchmarkReturns.push(...returns);
    });

    // Portfolio Returns
    // Calculate weights based on current market values (or just input quantities * last price)
    const lastPrices = tickers.map((t: string) => assetPrices[t][assetPrices[t].length - 1]);
    const assetValues = assets.map((a: any, i: number) => a.quantity * lastPrices[i]);
    const totalValue = assetValues.reduce((a: number, b: number) => a + b, 0);
    const weights = assetValues.map((v: number) => v / totalValue);

    const portfolioReturns: number[] = [];
    for (let i = 0; i < benchmarkReturns.length; i++) {
      let pReturn = 0;
      tickers.forEach((ticker: string, idx: number) => {
        pReturn += assetReturns[ticker][i] * weights[idx];
      });
      portfolioReturns.push(pReturn);
    }

    // Computed Stats
    const pCumReturns = [1];
    portfolioReturns.forEach(r => pCumReturns.push(pCumReturns[pCumReturns.length - 1] * (1 + r)));
    
    const bCumReturns = [1];
    benchmarkReturns.forEach(r => bCumReturns.push(bCumReturns[bCumReturns.length - 1] * (1 + r)));

    const pTotalReturn = pCumReturns[pCumReturns.length - 1] - 1;
    const bTotalReturn = bCumReturns[bCumReturns.length - 1] - 1;

    const annualizedFactor = 252; // Trade days
    const pAnnReturn = Math.pow(1 + pTotalReturn, annualizedFactor / portfolioReturns.length) - 1;
    const pVol = ss.standardDeviation(portfolioReturns) * Math.sqrt(annualizedFactor);
    const sharpe = (pAnnReturn - (riskFreeRate / 100)) / pVol;

    // Beta and Alpha (using linear regression y = portfolio, x = benchmark)
    const regression = ss.linearRegression(benchmarkReturns.map((r, i) => [r, portfolioReturns[i]]));
    const beta = regression.m;
    const alpha = (pAnnReturn - (riskFreeRate / 100)) - beta * (ss.mean(benchmarkReturns) * annualizedFactor - (riskFreeRate / 100));

    // VaR (95%)
    const sortedReturns = [...portfolioReturns].sort((a, b) => a - b);
    const var95 = sortedReturns[Math.floor(sortedReturns.length * 0.05)];

    // Max Drawdown
    let maxDrawdown = 0;
    let peak = -Infinity;
    pCumReturns.forEach(val => {
      if (val > peak) peak = val;
      const dd = (peak - val) / peak;
      if (dd > maxDrawdown) maxDrawdown = dd;
    });

    // Efficient Frontier (Simplified: Random portfolios)
    const efPortfolios = [];
    const numAssets = tickers.length;
    for (let i = 0; i < 500; i++) {
      let randomWeights = Array.from({ length: numAssets }, () => Math.random());
      const sum = randomWeights.reduce((a, b) => a + b, 0);
      randomWeights = randomWeights.map(w => w / sum);

      let portReturn = 0;
      let portVol = 0;
      
      // Port return
      const avgReturns = tickers.map((t: string) => ss.mean(assetReturns[t]) * annualizedFactor);
      portReturn = math.dot(randomWeights, avgReturns);

      // Port Vol (using covariance matrix)
      // For speed, let's just calculate port returns and get SD
      const pReturns: number[] = [];
      for (let j = 0; j < portfolioReturns.length; j++) {
        let r = 0;
        tickers.forEach((ticker: string, idx: number) => {
          r += assetReturns[ticker][j] * randomWeights[idx];
        });
        pReturns.push(r);
      }
      portVol = ss.standardDeviation(pReturns) * Math.sqrt(annualizedFactor);
      efPortfolios.push({ return: portReturn, volatility: portVol });
    }

    // Correlation Matrix
    const correlationMatrix: any = [];
    tickers.forEach((t1: string) => {
      const row: any = { name: t1 };
      tickers.forEach((t2: string) => {
        row[t2] = ss.sampleCorrelation(assetReturns[t1], assetReturns[t2]);
      });
      correlationMatrix.push(row);
    });

    // Monte Carlo (1000 paths)
    const mcPaths = 1000;
    const mcSteps = 252; // 1 year forward
    const mcResults = [];
    const meanReturn = ss.mean(portfolioReturns);
    const stdDev = ss.standardDeviation(portfolioReturns);

    for (let i = 0; i < mcPaths; i++) {
      let currentVal = 1;
      for (let j = 0; j < mcSteps; j++) {
        // Standard Normal using Box-Muller transform
        const u1 = Math.random();
        const u2 = Math.random();
        const rand = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        
        const dailyReturn = meanReturn + stdDev * rand;
        currentVal *= (1 + dailyReturn);
      }
      mcResults.push(currentVal);
    }
    mcResults.sort((a, b) => a - b);
    const mcBest = mcResults[mcResults.length - 1];
    const mcWorst = mcResults[0];
    const mcMedian = mcResults[Math.floor(mcPaths / 2)];

    // Black-Litterman (Simplified: Adjusted weights based on Sharpe)
    // Heuristic: overweight higher sharpe assets
    const assetSharpes = tickers.map((t: string, i: number) => {
      const annReturn = ss.mean(assetReturns[t]) * annualizedFactor;
      const vol = ss.standardDeviation(assetReturns[t]) * Math.sqrt(annualizedFactor);
      return (annReturn - (riskFreeRate / 100)) / vol;
    });
    const totalSharpe = assetSharpes.reduce((a: number, b: number) => a + (b > 0 ? b : 0), 0);
    const blWeights = assetSharpes.map(s => (s > 0 ? s / totalSharpe : 0));

    // Market Regime
    const last30Returns = benchmarkReturns.slice(-30);
    const avg30 = ss.mean(last30Returns) * annualizedFactor;
    const vol30 = ss.standardDeviation(last30Returns) * Math.sqrt(annualizedFactor);
    let regime = "Bull";
    if (avg30 < 0) regime = "Bear";
    if (vol30 > 0.3) regime = "Highly Volatile";

    const response = {
      overview: {
        portfolioReturn: pTotalReturn,
        benchmarkReturn: bTotalReturn,
        alpha,
        beta,
        totalValue,
        chartData: commonDates.map((date: string, i: number) => ({
          date,
          portfolio: pCumReturns[i],
          benchmark: bCumReturns[i]
        }))
      },
      risk: {
        volatility: pVol,
        sharpe,
        maxDrawdown,
        var95,
        drawdownChart: pCumReturns.map((val, i) => {
          const p = Math.max(...pCumReturns.slice(0, i + 1));
          return { date: commonDates[i], drawdown: (p - val) / p };
        })
      },
      efficientFrontier: {
        portfolios: efPortfolios,
        current: { return: pAnnReturn, volatility: pVol }
      },
      diversification: {
        correlationMatrix,
        riskContribution: tickers.map((t: string, i: number) => {
          const vol = ss.standardDeviation(assetReturns[t]) * Math.sqrt(annualizedFactor);
          return { name: t, contribution: vol * weights[i] };
        })
      },
      monteCarlo: {
        best: mcBest,
        worst: mcWorst,
        median: mcMedian,
        distribution: mcResults.map((val, i) => ({ val, count: i })) // simplified for chart
      },
      smartAllocation: {
        currentWeights: weights.map((w, i) => ({ name: tickers[i], weight: w })),
        suggestedWeights: blWeights.map((w, i) => ({ name: tickers[i], weight: w }))
      },
      market: {
        regime
      }
    };

    res.json(response);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
