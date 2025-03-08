"use server";
import { analyzeStock } from "@/utils/stock";
import OpenAI from "openai";
const openAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const gptProcessData = async (
  analyzedStock: ReturnType<typeof analyzeStock>,
  symbol: string
) => {
  try {
    // Generate a summary using OpenAI
    const prompt = `Analyze the stock ${symbol}. 
        - DCF value: ${analyzedStock.details.dcfValue} 
        - P/E Ratio: ${analyzedStock.details.peRatio} 
        - P/B Ratio: ${analyzedStock.details.pbRatio} 
        - Dividend Yield: ${analyzedStock.details.dividendYield}% 
        - D/E Ratio: ${analyzedStock.details.debtEquityRatio} 
        - Graham Value: ${analyzedStock.details.grahamValue} 
        - Score: ${analyzedStock.score} 
        - Recommendation: ${analyzedStock.recommendation}. 

        Provide a short explanation on why this stock is a ${analyzedStock.recommendation}.`;
    const openaiResponse = await openAI.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a financial analyst." },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
    });
    return openaiResponse.choices[0].message.content;
  } catch (error) {
    console.error(error);
  }
};

export { gptProcessData };
