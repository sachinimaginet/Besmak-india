"use client";

import React from "react";
import { motion } from "framer-motion";

interface CapabilityRow {
  label: string;
  value: string;
}

interface ColumnData {
  title: string;
  description: string;
  rows: CapabilityRow[];
}

interface AboutCapabilitiesProps {
  content?: {
    leftColumn?: ColumnData;
    rightColumn?: ColumnData;
  };
}

export default function AboutCapabilities({ content }: AboutCapabilitiesProps) {
  const defaultLeft: ColumnData = {
    title: "MOULD MAKING",
    description:
      "We have the capability to design and build complex moulds for machines up to 500 Tons. Our in-house mould-making facility ensures reduced lead times, tighter tolerances, and full control over quality.",
    rows: [
      { label: "Machine Capacity", value: "Up to 500 Tons" },
      { label: "Mould Weight", value: "Up to 5 Tons" },
      { label: "Annual Capacity", value: "100 Moulds / Year" },
    ],
  };

  const defaultRight: ColumnData = {
    title: "PROJECT MANAGEMENT",
    description:
      "A dedicated team of qualified and experienced engineers handle every project awarded to us by our customers. Right from the start, this team works closely with customers till the part is proven to their satisfaction.",
    rows: [
      { label: "Approach", value: "Design to Delivery" },
      { label: "Team", value: "Qualified Engineers" },
      { label: "Commitment", value: "On-Time Every Time" },
    ],
  };

  const leftColumn = content?.leftColumn || defaultLeft;
  const rightColumn = content?.rightColumn || defaultRight;

  return (
    <section className="py-16 bg-[#284b8c] text-white w-full">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-1 bg-white"></div>
              <h2 className="text-2xl font-bold uppercase tracking-wide">
                {leftColumn.title}
              </h2>
            </div>

            <p className="text-gray-300 leading-relaxed mb-8">
              {leftColumn.description}
            </p>

            <div className="flex flex-col gap-4">
              {leftColumn.rows.map((row, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-[#203c70] rounded-lg border-l-4 border-l-white border-l-primary py-4 px-6 shadow-sm"
                >
                  <span className="text-gray-300">{row.label}</span>
                  <span className="text-white font-bold">{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-1 bg-white"></div>
              <h2 className="text-2xl font-bold uppercase tracking-wide">
                {rightColumn.title}
              </h2>
            </div>

            <p className="text-gray-300 leading-relaxed mb-8">
              {rightColumn.description}
            </p>

            <div className="flex flex-col gap-4">
              {rightColumn.rows.map((row, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-[#203c70] rounded-lg border-l-4 border-l-white border-l-primary py-4 px-6 shadow-sm"
                >
                  <span className="text-gray-300">{row.label}</span>
                  <span className="text-white font-bold">{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
