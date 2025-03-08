"use client";
import React from "react";
import { useState } from "react";

import { useRouter } from "next/navigation";
import { Input } from "./ui/input";

export const InputStockSymbol = () => {
  const [symbol, setSymbol] = useState("");

  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(event.target.value.toUpperCase());
  };

  const handleInputBlur = () => {
    if (symbol) {
      router.push(`/?symbol=${symbol}`);
    } else {
      router.push("/");
    }
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && symbol) {
      router.push(`/?symbol=${symbol}`);
    }
  };

  return (
    <Input
      placeholder="Enter stock symbol hit enter or click outside"
      value={symbol}
      onChange={handleInputChange}
      onBlur={handleInputBlur}
      onKeyDown={handleKeyPress}
    />
  );
};
