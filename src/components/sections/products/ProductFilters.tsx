"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  X,
  Filter,
  ChevronDown,
  Layers,
  Hash,
  Box,
  Cpu,
  Palette,
  Droplets,
  Settings2,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

interface ProductFiltersProps {
  filterGroups: FilterGroup[];
}

export default function ProductFilters({ filterGroups }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {
      categoryId: true,
      series: true,
      categoryNumber: true,
    },
  );

  const activeFiltersCount = Array.from(searchParams.keys()).filter(
    (key) => key !== "q" && key !== "page",
  ).length;

  const updateFilter = (id: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(id, value);
    } else {
      params.delete(id);
    }
    params.delete("page");
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const clearAll = () => {
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    if (q) params.set("q", q);
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getIcon = (id: string) => {
    switch (id) {
      case "categoryId":
        return <Layers className="h-4 w-4" />;
      case "categoryNumber":
        return <Hash className="h-4 w-4" />;
      case "series":
        return <Settings2 className="h-4 w-4" />;
      case "way":
        return <Cpu className="h-4 w-4" />;
      case "material":
        return <Box className="h-4 w-4" />;
      case "colour":
        return <Palette className="h-4 w-4" />;
      case "mf":
        return <Box className="h-4 w-4" />;
      case "sealed":
        return <Droplets className="h-4 w-4" />;
      default:
        return <Filter className="h-4 w-4" />;
    }
  };

  const FilterContent = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
          <div className="bg-primary p-1 rounded-md">
            <Filter className="h-3.5 w-3.5 text-white" />
          </div>
          Refine Search
        </h3>
      </div>

      <div className="space-y-2">
        {filterGroups.map((group) => {
          const activeValue = searchParams.get(group.id) || "";
          const isExpanded = expandedGroups[group.id] ?? false;
          const isActive = !!activeValue;

          return (
            <div
              key={group.id}
              className={`rounded-lg border transition-all duration-300 ${
                isActive
                  ? "border-primary/20 bg-primary/5"
                  : "border-gray-50 bg-gray-50/20"
              }`}
            >
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between p-3 text-xs font-bold text-gray-800 hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`${isActive ? "text-primary" : "text-gray-400"}`}
                  >
                    {getIcon(group.id)}
                  </span>
                  <span>{group.label}</span>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown
                    className={`h-3.5 w-3.5 ${isActive ? "text-primary" : "text-gray-400"}`}
                  />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3">
                      <select
                        value={activeValue}
                        onChange={(e) => updateFilter(group.id, e.target.value)}
                        className={`w-full bg-white border rounded-md py-1.5 px-2 text-xs text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm font-medium ${
                          isActive ? "border-primary/40" : "border-gray-200"
                        }`}
                      >
                        <option value="">Select {group.label}</option>
                        {group.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden mb-4 px-1">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="w-full flex items-center justify-between bg-white border border-gray-200 p-3 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Filter className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">Filters</span>
          </div>
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm sticky top-20 h-fit">
        <FilterContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-[85%] bg-white shadow-2xl rounded-l-3xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-50">
                <h2 className="font-bold text-xl text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto h-[calc(100%-140px)]">
                <FilterContent />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/10 active:scale-[0.98] transition-all"
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
