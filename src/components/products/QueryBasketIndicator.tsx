"use client";

import { useQueryBasket } from "@/context/QueryBasketContext";
import { Inbox, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QueryModal from "./QueryModal";

export default function QueryBasketIndicator() {
  const { itemCount } = useQueryBasket();
  const [isOpen, setIsOpen] = useState(false);

  if (itemCount === 0) return null;

  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 100 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0, y: 100 }}
        className="fixed bottom-8 right-8 z-999"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="relative group bg-primary text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(0,70,155,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(0,70,155,0.5)] transition-all duration-500 hover:-translate-y-1 active:scale-95"
        >
          <Inbox className="w-8 h-8 group-hover:rotate-12 transition-transform duration-500" />

          <AnimatePresence>
            <motion.div
              key={itemCount}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-2 -right-2 w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[13px] font-black shadow-lg border-2 border-white"
            >
              {itemCount}
            </motion.div>
          </AnimatePresence>

          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-2xl bg-primary animate-ping opacity-20 pointer-events-none" />
        </button>
      </motion.div>

      <QueryModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
