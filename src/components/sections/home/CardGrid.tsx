"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
      "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/Frame%202147224470.png",
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
      "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/Frame%202147224469.png",
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
    isDark: false,
    defaultExpanded: true
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
              hovered !== null ? hovered : getDefaultExpanded(rowCards);

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
                        className={`cg-card__link${isExpanded ? " cg-card__link--vis" : ""}`}
                        style={{ color: linkColor }}
                        tabIndex={isExpanded ? 0 : -1}
                      >
                        {/* Text block — top-left */}
                        <div className="cg-card__text">
                          <span
                            className="cg-card__cat"
                            style={{ color: catColor }}
                          >
                            {card.category}
                          </span>
                          <h3
                            className={`cg-card__title${isExpanded ? " cg-card__title--big" : ""}`}
                            style={{ color: titleColor }}
                          >
                            {card.title}
                          </h3>
                        </div>


                        {/* Product image — bottom-right area */}
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
            className="inline-flex items-center gap-2 border-2 border-[#1a4fa0] text-[#1a4fa0] px-8 py-3 rounded-full font-bold hover:bg-[#1a4fa0] hover:text-white transition-all duration-300"
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
          font-size: 1rem;
          color: #6b7280;
          max-width: 42rem;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* ── Row wrapper ───────────────────────────────────────── */
        .cg-rows {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .cg-row {
          display: flex;
          gap: 1rem;
          height: 19rem;
        }

        /* ── Card ──────────────────────────────────────────────── */
        .cg-card {
          flex: 1;
          border-radius: 1.1rem;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          /* Smooth expand / shrink */
          transition: flex 0.42s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .cg-card--exp {
          flex: 2.5;
        }

        /* ── Text block (always top-left) ──────────────────────── */
        .cg-card__text {
          position: absolute;
          top: 1.4rem;
          left: 1.4rem;
          z-index: 2;
          display: flex;
          flex-direction: column;
        }

        .cg-card__cat {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          margin-bottom: 0.2rem;
          white-space: nowrap;
          line-height: 1.4;
        }

        .cg-card__title {
          font-size: 1.45rem;
          font-weight: 400;
          line-height: 1.15;
          margin: 0;
          white-space: pre-wrap;
          /* Title grows smoothly */
          transition:
            font-size 0.42s cubic-bezier(0.4, 0, 0.2, 1),
            font-weight 0.2s ease;
        }
        .cg-card__title--big {
          font-size: 2.35rem;
          font-weight: 700;
        }

        /* View More — zero-height hidden unless expanded */
        .cg-card__link {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.82rem;
          font-weight: 500;
          text-decoration: none;
          margin-top: 0.75rem;
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          white-space: nowrap;
          pointer-events: none;
          transition:
            max-height 0.38s ease,
            opacity 0.35s ease;
        }
        .cg-card__link--vis {
          max-height: 2rem;
          opacity: 1;
          pointer-events: auto;
        }

        /* ── Product image ─────────────────────────────────────── */
        .cg-card__img-wrap {
          position: absolute;
          /* sits bottom-right, takes right 55% of card */
          bottom: 0;
          right: 0;
          width: 70%;
          height: 100%;
          z-index: 1;
        }
        .cg-card__img {
          object-position: right bottom;
          transition: transform 0.42s ease;
        }
        .cg-card--exp .cg-card__img {
          transform: scale(1.06);
        }

        /* ── Responsive ────────────────────────────────────────── */
        @media (max-width: 480px) {
          .cg-row {
            flex-direction: column;
            height: auto;
          }
          .cg-card {
            flex: none !important;
            height: 14rem;
          }
        }
      `}</style>
    </section >
  );
}
