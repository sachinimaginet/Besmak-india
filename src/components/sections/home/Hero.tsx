import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  content?: {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
  };
}

export default function Hero({ content }: HeroProps) {
  const {
    title = "Precision Manufacturing Solutions",
    subtitle = "Besmak India delivers high-quality industrial components for B2B needs. Explore our catalog of 500+ products.",
    ctaText = "View Our Products",
    ctaLink = "/products",
  } = content || {};

  return (
    <section className="bg-blue-900 text-white py-20">
      <div className="container mx-auto px-4 text-center max-w-7xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{title}</h1>
        <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
          {subtitle}
        </p>
        <Link
          href={ctaLink}
          className="inline-flex items-center bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors"
        >
          {ctaText}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
