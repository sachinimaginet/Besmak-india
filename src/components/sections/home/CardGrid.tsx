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
  bg: string;       // card background colour
  isDark: boolean;  // true = dark bg → white text
}

interface CardGridProps {
  content?: {
    title?: string;
    cards?: CardData[];
  };
}

const defaultCards: CardData[] = [
  /* ── Row 1 ────────────────────────────────── */
  {
    id: "connectors",
    category: "Automotive",
    categoryColor: "rgba(255,255,255,0.75)",
    title: "Connectors",
    image:
      "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/167574675e2d8b125fbaaaf1b9a7dd028a95e6f5.png",
    href: "/products/connectors",
    bg: "#1a4fa0",
    isDark: true,
  },
  {
    id: "fuse-box",
    category: "High Precision",
    categoryColor: "#4a90d9",
    title: "Fuse Box",
    image:
      "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/1f7673b32195506c3e16ca7fedc10f5d3a08d3b0.png",
    href: "/products/fuse-box",
    bg: "#dce9f7",
    isDark: false,
  },
  {
    id: "dummy-plugs",
    category: "Connection System",
    categoryColor: "#b07c0a",
    title: "Dummy Plugs",
    image:
      "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/6bbf541a3751e6d87bb11f101e191a95e5d24d58.png",
    href: "/products/dummy-plugs",
    bg: "#e6f3e2",
    isDark: false,
  },
  /* ── Row 2 ────────────────────────────────── */
  {
    id: "relay",
    category: "Precision Control",
    categoryColor: "#b07c0a",
    title: "Relay",
    image:
      "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/6420af06203961d21746289b7e874ff9a58f9440.png",
    href: "/products/relay",
    bg: "#f5ece0",
    isDark: false,
  },
  {
    id: "cases",
    category: "Housing Components",
    categoryColor: "#2e8b57",
    title: "Cases",
    image:
      "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/4619bea2ef8e89cf657c09c72c5bb81b40bdedaf.png",
    href: "/products/cases",
    bg: "#e6f3e2",
    isDark: false,
  },
  {
    id: "cable-tuf",
    category: "Cable Management",
    categoryColor: "rgba(255,255,255,0.75)",
    title: "Cable TUF",
    image:
      "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/e3f1e3094cda2b6a926451650265bbb4d9ca5ab9.png",
    href: "/products/cable-tuf",
    bg: "#1a4fa0",
    isDark: true,
  },
  /* ── Row 3 ────────────────────────────────── */
  {
    id: "cover",
    category: "Housing Components",
    categoryColor: "#b07c0a",
    title: "Cover",
    image:
      "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/2247c41c398bc9896bb054d9d143bfc429ab4d88.png",
    href: "/products/cover",
    bg: "#f5ece0",
    isDark: false,
  },
  {
    id: "clips",
    category: "Fastning Systems",
    categoryColor: "#2e8b57",
    title: "Clips",
    image:
      "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/71932dd7d557a3c819f0764768fa6f17576d179e.png",
    href: "/products/clips",
    bg: "#e6f3e2",
    isDark: false,
  },
  {
    id: "connection-systems",
    category: "Connection Systems",
    categoryColor: "rgba(255,255,255,0.75)",
    title: "Terminals",
    image:
      "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/de2ecd4bd7af1d3dcd61a30720645dc39bad67cc.png",
    href: "/products/connection-systems",
    bg: "#1a4fa0",
    isDark: true,
  },
];

const ROW_SIZE = 3;

// Default expanded card index within each row
// Row 0 → first card (0), last row → last card (ROW_SIZE - 1)
function getDefaultExpanded(rowIndex: number, totalRows: number): number {
  if (rowIndex === 0) return 0;
  if (rowIndex === totalRows - 1) return ROW_SIZE - 1;
  return 0;
}

export default function CardGrid({ content }: CardGridProps) {
  const {
    title = "Precision Engineered Components",
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

  const totalRows = rows.length;

  return (
    <section className="cg-section py-12 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="cg-heading">{title}</h2>

        <div className="cg-rows">
          {rows.map((rowCards, rowIndex) => {
            const hovered = hoverByRow[rowIndex];
            const expandedIdx =
              hovered !== null ? hovered : getDefaultExpanded(rowIndex, totalRows);

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
      </div>

      <style jsx>{`
        /* ── Heading ───────────────────────────────────────────── */
        .cg-heading {
          text-align: center;
          font-size: 2rem;
          font-weight: 400;
          color: #111827;
          margin-bottom: 2.5rem;
          font-family: Georgia, "Times New Roman", serif;
          letter-spacing: -0.01em;
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
          width: 60%;
          height: 80%;
          z-index: 1;
        }
        .cg-card__img {
          object-position: center bottom;
          transition: transform 0.42s ease;
        }
        .cg-card--exp .cg-card__img {
          transform: scale(1.06);
        }

        /* ── Responsive ────────────────────────────────────────── */
        @media (max-width: 768px) {
          .cg-row {
            flex-direction: column;
            height: auto;
          }
          .cg-card {
            flex: none !important;
            height: 13rem;
          }
        }
      `}</style>
    </section >
  );
}
