"use client";

import { useQueryBasket, BasketProduct } from "@/context/QueryBasketContext";
import { Plus, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AddToQueryButtonProps {
  product: BasketProduct;
}

export default function AddToQueryButton({ product }: AddToQueryButtonProps) {
  const { addToBasket, isInBasket, removeFromBasket } = useQueryBasket();
  const [isAdding, setIsAdding] = useState(false);

  const inBasket = isInBasket(product.id);

  const handleToggle = () => {
    if (inBasket) {
      removeFromBasket(product.id);
    } else {
      setIsAdding(true);
      // Simulate a small delay for premium feel
      setTimeout(() => {
        addToBasket(product);
        setIsAdding(false);
      }, 600);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isAdding}
      className={`w-full relative overflow-hidden group py-4 rounded-xl font-black text-[12px] uppercase tracking-widest transition-all duration-500 active:scale-[0.98] flex items-center justify-center gap-2 ${
        inBasket
          ? "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100"
          : "bg-primary text-white shadow-[0_15px_30px_-5px_rgba(0,70,155,0.3)] hover:shadow-[0_20px_40px_-5px_rgba(0,70,155,0.4)]"
      }`}
    >
      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Adding to Query...
          </motion.div>
        ) : inBasket ? (
          <motion.div
            key="in-basket"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Added to Query
          </motion.div>
        ) : (
          <motion.div
            key="add"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            Add to Query
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle shine effect */}
      <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
    </button>
  );
}
