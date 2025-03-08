export type StockDataType = {
  price: number;
  eps: number;
  bookValue: number;
  annualDividend: number;
  totalDebt: number;
  totalEquity: number;
  growthRate: number;
  discountedCashFlows: number[];
  symbol: string;
};

export const analyzeStock = (stockData: StockDataType) => {
  let score = 0;

  // Criteria values
  const INDUSTRY_PE = 15; // Example value
  const MIN_DIVIDEND_YIELD = 2; // 2%
  const SAFE_DE_RATIO = 1; // Max 1.0

  // Apply formulas
  const peRatio = stockData.price / stockData.eps;
  const pbRatio = stockData.price / stockData.bookValue;
  const dividendYield = (stockData.annualDividend / stockData.price) * 100;
  const debtEquityRatio = stockData.totalDebt / stockData.totalEquity;

  // Graham’s Formula Calculation
  const grahamValue =
    ((stockData.eps * (8.5 + 2 * stockData.growthRate)) / 4.4) * 4;

  // DCF Calculation (simplified for example)
  const dcfValue = stockData.discountedCashFlows.reduce((acc, cf, i) => {
    return acc + cf / Math.pow(1.1, i + 1); // Assuming 10% discount rate
  }, 0);

  // Apply scoring
  if (peRatio < INDUSTRY_PE) score++;
  if (pbRatio < 1.5) score++;
  if (dividendYield > MIN_DIVIDEND_YIELD) score++;
  if (debtEquityRatio < SAFE_DE_RATIO) score++;
  if (grahamValue > stockData.price) score++;
  if (dcfValue > stockData.price) score++;

  // Decision
  return {
    stock: stockData.symbol,
    score,
    recommendation: score >= 4 ? "BUY" : score >= 2 ? "HOLD" : "SELL",
    details: {
      peRatio,
      pbRatio,
      dividendYield,
      debtEquityRatio,
      grahamValue,
      dcfValue,
    },
  };
};

export function calculateWACC(totalDebt: number, debtToEquityRatio: number) {
  const totalEquity = totalDebt / debtToEquityRatio;
  const totalCapital = totalDebt + totalEquity;

  const equityWeight = totalEquity / totalCapital;
  const debtWeight = totalDebt / totalCapital;

  return equityWeight * 0.112 + debtWeight * 0.05 * (1 - 0.21);
}

export function calculateDiscountedCashFlows(
  freeCashFlow: number,
  growthRate: number,
  discountRate: number
) {
  const discountedCashFlows = [];

  for (let t = 1; t <= 5; t++) {
    // Project future FCF
    const futureFCF = freeCashFlow * Math.pow(1 + growthRate, t);
    // Discount to present value
    const discountedFCF = futureFCF / Math.pow(1 + discountRate, t);
    // Store result
    discountedCashFlows.push(discountedFCF);
  }

  return discountedCashFlows;
}

export const mappingStockResult = {
  peRatio: "P/E Ratio",
  pbRatio: "P/B Ratio",
  dividendYield: "Dividend Yield",
  debtEquityRatio: "Debt/Equity Ratio",
  grahamValue: "Graham Value",
  dcfValue: "DCF Value",
};
