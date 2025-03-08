"use server";

import {
  analyzeStock,
  calculateDiscountedCashFlows,
  calculateWACC,
} from "@/utils/stock";
import yahooFinance from "yahoo-finance2";
import { gptProcessData } from "./openAi";

export const getStockSummary = async (symbol: string) => {
  try {
    const data = await yahooFinance.quoteSummary(symbol, {
      modules: ["financialData", "summaryDetail"],
    });

    const eps =
      Math.floor(
        (data.financialData?.totalRevenue ?? 0) *
          (data.financialData?.totalRevenue ?? 0)
      ) / (data.financialData?.revenuePerShare ?? 1);
    const previousEps = eps / 1 + (data.financialData?.revenueGrowth ?? 0);
    const epsGrowth = ((eps - previousEps) / previousEps) * 100;
    const totalEquity = Math.floor(
      (data.financialData?.totalDebt ?? 0) /
        ((data.financialData?.debtToEquity ?? 0) / 100)
    );
    const totalSharesOutstanding = Math.floor(
      (data.financialData?.totalCash ?? 0) /
        (data.financialData?.totalCashPerShare ?? 0)
    );
    const bookValue = totalEquity / totalSharesOutstanding;
    const discountRate = calculateWACC(
      data.financialData?.totalDebt ?? 0,
      data.financialData?.debtToEquity ?? 0
    );
    const discountedCashFlows = calculateDiscountedCashFlows(
      data.financialData?.freeCashflow ?? 0,
      epsGrowth,
      discountRate
    );

    const mapData = {
      price: data.financialData?.currentPrice ?? 0,
      eps: eps ?? 0,
      bookValue: bookValue ?? 0,
      annualDividend: data.summaryDetail?.dividendRate ?? 0,
      totalDebt: data.financialData?.totalDebt ?? 0,
      totalEquity: totalEquity ?? 0,
      growthRate: epsGrowth ?? 0,
      discountedCashFlows: discountedCashFlows,
      symbol,
    };
    const gptResponse = await gptProcessData(analyzeStock(mapData), symbol);

    return { analysis: analyzeStock(mapData), gptResponse };
  } catch {
    return {
      error: true,
      message: "Error fetching data",
    };
  }
};
