"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface CardData {
  id: string;
  category: string;
  categoryColor: string; // colour of the small category label
  title: string;
  image: string;
  href: string;
  bg: string;            // card background colour
  isDark: boolean;       // true = dark bg → white text
  defaultExpanded?: boolean; // marks the card expanded by default in its row
}

interface CardGridProps {
  content?: {
    title?: string;
    subtitle?: string;
    cards?: CardData[];
  };
}

const defaultCards: CardData[] = [
  /* ── Row 1 ────────────────────────────────── */
  {
    id: "connectors-systems",
    category: "",
    categoryColor: "rgba(255,255,255,0.75)",
    title: "Connection Systems",
    image:
      "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/167574675e2d8b125fbaaaf1b9a7dd028a95e6f5.png",
    href: "/products/connectors",
    bg: "#1a4fa0",
    isDark: true,
    defaultExpanded: true,
  },
  {
    id: "Engineering-Products-Division",
    category: "",
    categoryColor: "#4a90d9",
    title: "Engineering Products Division",
    image:
      "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/Stamping-Tools.png",
    href: "/products/fuse-box",
    bg: "#dce9f7",
    isDark: false,
  },
  /* ── Row 2 ────────────────────────────────── */
  {
    id: "Precision-Stamping-Manufacturing",
    category: "",
    categoryColor: "#b07c0a",
    title: "Precision Stamping Manufacturing",
    image:
      "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/Gemini_Generated_Image_x6z4itx6z4itx6z4%20%281%29.png",
    href: "/products/dummy-plugs",
    bg: "#e6f3e2",
    isDark: false,
  },
  {
    id: "CNH-Moulds",
    category: "",
    categoryColor: "#b07c0a",
    title: "CNH Moulds",
    image:
      "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/div%20%281%29.png",
    href: "/products/relay",
    bg: "#f5ece0",
    isDark: false
  }
];

const ROW_SIZE = 2;

// Returns the index of the card marked defaultExpanded in a row, or 0 as fallback
function getDefaultExpanded(rowCards: CardData[]): number {
  const idx = rowCards.findIndex((c) => c.defaultExpanded);
  return idx === -1 ? 0 : idx;
}

export default function CardGrid({ content }: CardGridProps) {
  const {
    title = "Precision Engineered Components",
    subtitle = "At Besmak, we deliver cutting-edge industrial solutions built on innovation, operational excellence, and uncompromising quality.",
    cards = defaultCards,
  } = content || {};

  // Split cards into rows
  const rows: CardData[][] = [];
  for (let r = 0; r < Math.ceil(cards.length / ROW_SIZE); r++) {
    rows.push(cards.slice(r * ROW_SIZE, (r + 1) * ROW_SIZE));
  }

  // Per-row hover state (null = no hover → use default)
  const [hoverByRow, setHoverByRow] = useState<(number | null)[]>(
    Array(rows.length).fill(null),
  );

  return (
    <section className="cg-section py-12 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-10">
          <h2 className="cg-heading">{title}</h2>
          {subtitle && <p className="cg-subtitle">{subtitle}</p>}
        </div>

        <div className="cg-rows">
          {rows.map((rowCards, rowIndex) => {
            const hovered = hoverByRow[rowIndex];
            const expandedIdx =
              hovered !== null
                ? hovered
                : (rowIndex === 0 ? getDefaultExpanded(rowCards) : null);

            return (
              <div key={rowIndex} className="cg-row">
                {rowCards.map((card, cardIdx) => {
                  const isExpanded = expandedIdx === cardIdx;
                  const titleColor = card.isDark ? "#ffffff" : "#111827";
                  const catColor = card.isDark
                    ? "rgba(255,255,255,0.7)"
                    : card.categoryColor;
                  const linkColor = card.isDark ? "#ffffff" : "#1a4fa0";

                  return (

                    <div
                      key={card.id}
                      className={`cg-card${isExpanded ? " cg-card--exp" : ""}`}
                      style={{ background: card.bg }}
                      onMouseEnter={() =>
                        setHoverByRow((prev) => {
                          const next = [...prev];
                          next[rowIndex] = cardIdx;
                          return next;
                        })
                      }
                      onMouseLeave={() =>
                        setHoverByRow((prev) => {
                          const next = [...prev];
                          next[rowIndex] = null;
                          return next;
                        })
                      }
                    >
                      <Link
                        href={card.href}
                        className="cg-card__link"
                        style={{ color: linkColor }}
                      >
                        {/* Text block */}
                        <div className="cg-card__text">
                          {card.category && (
                            <span
                              className="cg-card__cat"
                              style={{ color: catColor }}
                            >
                              {card.category}
                            </span>
                          )}
                          <h3
                            className={`cg-card__title${isExpanded ? " cg-card__title--big" : ""}`}
                            style={{ color: titleColor, padding: 10 }}
                          >
                            {card.title}
                          </h3>

                          <div className="cg-card__explore pl-5">
                            <span>Explore</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>


                        {/* Product image area */}
                        <div className="cg-card__img-wrap">
                          <Image
                            src={card.image}
                            alt={card.title}
                            fill
                            className="cg-card__img object-contain"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 border-2 border-[#1a4fa0] text-[#1a4fa0] px-8 py-3 rounded-md font-bold hover:bg-[#1a4fa0] hover:text-white transition-all duration-300"
          >
            Explore All Products
          </Link>
        </div>
      </div>

      <style jsx>{`
        /* ── Heading ───────────────────────────────────────────── */
        .cg-heading {
          text-align: center;
          font-size: 2.75rem;
          font-weight: 400;
          color: #111827;
          margin-bottom: 0.5rem;
          font-family: var(--font-heading), serif;
          letter-spacing: -0.01em;
        }
        .cg-subtitle {
          text-align: center;
          font-size: 1.25rem;
          color: #6b7280;
          max-width: 52rem;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* ── Row wrapper ───────────────────────────────────────── */
        .cg-rows {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .cg-row {
          display: flex;
          gap: 1.5rem;
          height: 22rem;
        }

        /* ── Card ──────────────────────────────────────────────── */
        .cg-card {
          flex: 1;
          border-radius: 1.5rem;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          transition: flex 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s ease, box-shadow 0.3s ease;
        }

        .cg-card:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .cg-card--exp {
          flex: 2.8;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .cg-card__link {
          display: flex;
          flex-direction: column;
          height: 100%;
          text-decoration: none;
          padding: 3rem;
          position: relative;
          z-index: 2;
          overflow: hidden;
        }

        /* ── Text block ──────────────────────── */
        .cg-card__text {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          width: 55%; /* Slightly wider to accommodate larger padding */
        }

        .cg-card__cat {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
          text-transform: uppercase;
          opacity: 0.8;
        }

        .cg-card__title {
          font-size: 1.6rem;
          font-weight: 500;
          line-height: 1.1;
          margin: 0;
          white-space: pre-wrap;
          transition: font-size 0.6s cubic-bezier(0.16, 1, 0.3, 1), font-weight 0.4s ease;
          letter-spacing: -0.02em;
        }

        .cg-card--exp .cg-card__title {
          font-size: 2.75rem;
          font-weight: 700;
          max-width: 95%;
        }

        /* Explore / Learn More indicator */
        .cg-card__explore {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1rem;
          font-weight: 700;
          margin-top: 2rem;
          opacity: 0;
          transform: translateX(-15px);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cg-card--exp .cg-card__explore {
          opacity: 1;
          transform: translateX(0);
        }

        /* ── Product image ─────────────────────────────────────── */
        .cg-card__img-wrap {
          position: absolute;
          top: 0;
          right: 0;
          width: 65%;
          height: 100%;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          padding-right: 2rem;
          pointer-events: none;
        }
        
        .cg-card__img {
          object-position: right center !important;
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) !important;
          filter: drop-shadow(0 15px 25px rgba(0,0,0,0.1));
          transform: scale(0.9);
        }

        .cg-card--exp .cg-card__img-wrap {
          width: 60%;
        }

        .cg-card--exp .cg-card__img {
          transform: scale(1.15) translateX(-5%);
          filter: drop-shadow(0 25px 45px rgba(0,0,0,0.2));
        }

        /* Ambient Glow */
        .cg-card::after {
          content: '';
          position: absolute;
          top: -20%;
          right: -20%;
          width: 60%;
          height: 60%;
          background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
          z-index: 0;
          pointer-events: none;
          transition: opacity 0.5s ease;
        }

        /* ── Responsive ────────────────────────────────────────── */
        @media (max-width: 1024px) {
          .cg-card--exp .cg-card__title {
            font-size: 2.25rem;
          }
          .cg-card__link {
            padding: 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .cg-row {
            height: 18rem;
          }
          .cg-card__title {
            font-size: 1.35rem;
          }
          .cg-card--exp .cg-card__title {
            font-size: 1.85rem;
          }
          .cg-card__text {
            width: 60%;
          }
          .cg-card__link {
            padding: 2rem;
          }
        }

        @media (max-width: 480px) {
          .cg-row {
            flex-direction: column;
            height: auto;
            gap: 1.5rem;
          }
          .cg-card {
            flex: none !important;
            height: 20rem;
          }
          .cg-card__text {
            width: 80%;
          }
          .cg-card__img-wrap {
            width: 75%;
          }
          .cg-card__link {
            padding: 1.75rem;
          }
        }
      `}</style>
    </section >
  );
}
