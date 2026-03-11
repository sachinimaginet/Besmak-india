"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Mail, Phone, MapPin, ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface ContactHeroProps {
  content?: {
    title?: string;
    description?: string;
    bgImage?: string;
  };
}

export default function ContactHero({ content }: ContactHeroProps) {
  const {
    title = "Get in Touch",
    description = "Have questions or need a custom manufacturing solution? Our team of experts is ready to assist you.",
    bgImage = "/images/contact-hero.png",
  } = content || {};

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-900">
      {/* Background Image with Parallax-like scale effect */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img
          src={bgImage}
          alt="Contact Background"
          className="w-full h-full object-cover"
        />
        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/80 to-transparent" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Breadcrumbs */}
          <motion.div
            variants={itemVariants}
            className="flex items-center space-x-2 text-blue-200/60 mb-8 text-sm uppercase tracking-widest font-medium"
          >
            <Link href="/" className="hover:text-white transition-colors flex items-center">
              <Home className="w-3.5 h-3.5 mr-1" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-blue-100">Contact Us</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            {title}
            <span className="text-blue-400">.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-blue-100/80 mb-12 max-w-2xl leading-relaxed"
          >
            {description}
          </motion.p>

          {/* Contact Fast-Links/Highlights */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-white/10"
          >
            <div className="flex items-center space-x-4 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                <Mail className="w-6 h-6 text-blue-400 group-hover:text-white" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-blue-300 font-bold mb-1">Email Us</p>
                <p className="text-white font-medium">info@besmakindia.com</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                <Phone className="w-6 h-6 text-blue-400 group-hover:text-white" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-blue-300 font-bold mb-1">Call Us</p>
                <p className="text-white font-medium">+91 98845 00000</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                <MapPin className="w-6 h-6 text-blue-400 group-hover:text-white" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-blue-300 font-bold mb-1">Location</p>
                <p className="text-white font-medium">Chennai, Tamil Nadu</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Blur Element */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}
