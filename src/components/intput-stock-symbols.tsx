"use client";
import { useState } from "react";

import { useRouter } from "next/navigation";
import { Input } from "./ui/input";

export const InputStockSymbol = () => {
  const [symbol, setSymbol] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!/^[A-Z]*$/i.test(event.target.value)) {
      return;
    }
    setSymbol(event.target.value.toUpperCase());
  };

  const handleInputBlur = () => {
    if (symbol) {
      setIsThinking(true);
      router.push(`/?symbol=${symbol}`);
    } else {
      router.push("/");
    }
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && symbol) {
      setIsThinking(true);
      router.push(`/?symbol=${symbol}`);
    }
    if (event.key === "Enter" && !symbol) {
      router.push("/");
    }
  };

  return (
    <>
      <Input
        placeholder="Enter stock symbol hit enter or click outside"
        value={symbol}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyPress}
      />
      {isThinking && <span>thinking ...</span>}
    </>
  );
};
