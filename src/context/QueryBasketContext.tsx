"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface BasketProduct {
  id: string;
  name: string;
  slug: string;
  image?: string;
  categoryName?: string;
}

interface QueryBasketContextType {
  basket: BasketProduct[];
  addToBasket: (product: BasketProduct) => void;
  removeFromBasket: (productId: string) => void;
  clearBasket: () => void;
  isInBasket: (productId: string) => boolean;
  itemCount: number;
}

const QueryBasketContext = createContext<QueryBasketContextType | undefined>(
  undefined,
);

export function QueryBasketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [basket, setBasket] = useState<BasketProduct[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedBasket = localStorage.getItem("besmak_query_basket");
    if (savedBasket) {
      try {
        setBasket(JSON.parse(savedBasket));
      } catch (e) {
        console.error("Failed to parse basket from localStorage", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever basket changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("besmak_query_basket", JSON.stringify(basket));
    }
  }, [basket, isInitialized]);

  const addToBasket = (product: BasketProduct) => {
    setBasket((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromBasket = (productId: string) => {
    setBasket((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearBasket = () => {
    setBasket([]);
  };

  const isInBasket = (productId: string) => {
    return basket.some((p) => p.id === productId);
  };

  return (
    <QueryBasketContext.Provider
      value={{
        basket,
        addToBasket,
        removeFromBasket,
        clearBasket,
        isInBasket,
        itemCount: basket.length,
      }}
    >
      {children}
    </QueryBasketContext.Provider>
  );
}

export function useQueryBasket() {
  const context = useContext(QueryBasketContext);
  if (context === undefined) {
    throw new Error("useQueryBasket must be used within a QueryBasketProvider");
  }
  return context;
}
