"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { motion } from "framer-motion";

interface BoxContent {
  icon: string;
  title: string;
  description: string;
}

interface IconBoxesProps {
  content?: {
    boxes?: BoxContent[];
  };
}

export default function IconBoxes({ content }: IconBoxesProps) {
  const defaultBoxes: BoxContent[] = [
    {
      "icon": "Gauge",
      "title": "",
      "description": "Started in 1987 with toolroom, Besmak components incorporated on 1994. Besmak Components has provided high quality auto parts for over 25 years supporting the Automotive Wiring Harness in two wheeler and four wheeler segments."
    },
    {
      "icon": "Trophy",
      "title": "",
      "description": "25 years of expertise in manufacturing connectors and solutioned auto components for the Wiring Harness Industry."
    },
    {
      "icon": "Check",
      "title": "",
      "description": "Founded and promoted by Mr. C.N. HARI, the Company has developed a wide range of connectors and auto parts."
    },
  ];

  const boxes = content?.boxes && content.boxes.length > 0 ? content.boxes : defaultBoxes;

  const getIcon = (iconName: string) => {
    // Basic capitalization to match Lucide exports e.g., "star" -> "Star", "shield" -> "Shield"
    const formattedIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1);

    // @ts-ignore
    const IconComponent = LucideIcons[formattedIconName] || LucideIcons[iconName] || LucideIcons.HelpCircle;

    return (
      <IconComponent
        className="w-10 h-10 text-primary group-hover/card:text-white transition-colors duration-500 relative z-10"
        strokeWidth={1.5}
      />
    );
  };

  return (
    <section className="py-16 bg-white w-full">
      <div className="container mx-auto px-4 max-w-7xl">
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: "15px" }}
        >
          {boxes.map((box, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="group/card relative p-10 bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col items-center text-center transition-all duration-500 hover:shadow-[0_20px_40px_rgba(var(--primary-rgb),0.1)] hover:-translate-y-2"
            >
              {/* Expanding Background Effect */}
              <div className="absolute inset-x-0 bottom-0 h-0 bg-primary/5 transition-all duration-500 ease-out group-hover/card:h-full group-hover/card:bg-primary z-0 opacity-0 group-hover/card:opacity-100" />

              {/* Top accent line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full transition-all duration-500 group-hover/card:w-1/2 group-hover/card:bg-white z-10" />

              <div className="relative z-10 p-5 bg-gray-50 rounded-2xl mb-8 group-hover/card:bg-white/20 transition-colors duration-500 border border-gray-100 group-hover/card:border-white/30">
                {getIcon(box.icon)}
              </div>

              <h3 className="relative z-10 text-2xl font-bold text-gray-900 mb-4 group-hover/card:text-white transition-colors duration-500">
                {box.title}
              </h3>

              <p className="relative z-10 text-gray-600 leading-relaxed group-hover/card:text-white/90 transition-colors duration-500 text-sm md:text-base">
                {box.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
