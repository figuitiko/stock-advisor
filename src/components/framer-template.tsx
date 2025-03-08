"use client";
import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

export const FramerTemplate = ({ children }: PropsWithChildren) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", duration: 0.5 }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};
