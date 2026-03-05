"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Vertical {
    id: string;
    title: string;
    description: string;
    image: string;
    href: string;
}

interface StrategicVerticalsProps {
    content?: {
        heading?: string;
        subheading?: string;
        verticals?: Vertical[];
    };
}

const defaultVerticals: Vertical[] = [
    {
        id: "connection-systems",
        title: "Connection Systems",
        description:
            "The Connection Systems division is dedicated to designing and manufacturing high quality connector solutions that enable secure electrical and mechanical connectivity across applications.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
        href: "/divisions/connection-systems",
    },
    {
        id: "engineering-products",
        title: "Engineering Products Division",
        description:
            "Our Engineering Products Division delivers precision-engineered components built for performance, reliability, and long-term durability in demanding industrial environments.",
        image: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&q=80",
        href: "/divisions/engineering-products",
    },
    {
        id: "precision-stamping",
        title: "Precision Stamping Manufacturing",
        description:
            "We specialise in precision metal stamping, producing complex, tight-tolerance parts at scale for automotive, aerospace and industrial applications.",
        image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80",
        href: "/divisions/precision-stamping",
    },
    {
        id: "cnh-moulds",
        title: "CNH Moulds",
        description:
            "Our CNH Moulds division offers advanced mould design and manufacturing capabilities, delivering high-quality tooling solutions for complex part geometries.",
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80",
        href: "/divisions/cnh-moulds",
    },
];

export default function StrategicVerticals({
    content,
}: StrategicVerticalsProps) {
    const {
        heading = "Our Strategic Verticals",
        subheading = `At Besmak, we are not just building products. We are shaping the future of manufacturing — with purpose, passion and progress. Across every vertical, our focus remains on innovation, operational excellence and long term value for our customers, employees and stakeholders.`,
        verticals = defaultVerticals,
    } = content || {};

    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <section className="strategic-verticals py-20 bg-white">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-14">
                    <h2 className="text-4xl font-bold text-gray-900 mb-5">{heading}</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed text-base">
                        {subheading}
                    </p>
                </div>

                {/* Cards */}
                <div className="sv-grid">
                    {verticals.map((vertical) => {
                        const isHovered = hoveredId === vertical.id;
                        return (
                            <div
                                key={vertical.id}
                                className={`sv-card${isHovered ? " sv-card--hovered" : ""}`}
                                onMouseEnter={() => setHoveredId(vertical.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                {/* Gradient overlay — visible on hover */}
                                <div className="sv-card__gradient" aria-hidden="true" />

                                {/* Content wrapper */}
                                <div className="sv-card__inner">
                                    {/* Title row */}
                                    <h3 className="sv-card__title">{vertical.title}</h3>

                                    {/* Description — only on hover */}
                                    <p className="sv-card__description">{vertical.description}</p>

                                    {/* Product image — hides on hover */}
                                    <div className="sv-card__image-wrap">
                                        <Image
                                            src={vertical.image}
                                            alt={vertical.title}
                                            fill
                                            className="sv-card__image object-contain"
                                            sizes="(max-width: 768px) 100vw, 25vw"
                                        />
                                    </div>

                                    {/* View More link */}
                                    <Link href={vertical.href} className="sv-card__link">
                                        View More&nbsp;→
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
        /* ── Grid ──────────────────────────────────────────────── */
        .sv-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          align-items: stretch;
        }
        @media (max-width: 1024px) {
          .sv-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .sv-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ── Card base ─────────────────────────────────────────── */
        .sv-card {
          position: relative;
          border: 1.5px solid #c8daf5;
          border-radius: 1.25rem;
          overflow: hidden;
          cursor: pointer;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          min-height: 24rem;

          /* Smooth all transitions */
          transition:
            border-color 0.4s ease,
            box-shadow 0.4s ease;
        }

        .sv-card:hover,
        .sv-card--hovered {
          border-color: transparent;
          box-shadow: 0 20px 50px rgba(67, 97, 238, 0.25);
        }

        /* ── Gradient background (revealed on hover) ───────────── */
        .sv-card__gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(145deg, #4f8ef7 0%, #6c3ee8 100%);
          opacity: 0;
          transition: opacity 0.45s ease;
          z-index: 0;
          border-radius: inherit;
        }

        .sv-card--hovered .sv-card__gradient {
          opacity: 1;
        }

        /* ── Inner content ─────────────────────────────────────── */
        .sv-card__inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 1.75rem 1.5rem 1.5rem;
        }

        /* ── Title ─────────────────────────────────────────────── */
        .sv-card__title {
          font-size: 1rem;
          font-weight: 700;
          color: #1a56e8;
          line-height: 1.35;
          transition: color 0.35s ease;
          margin-bottom: 0.75rem;
          min-height: 2.5rem;
        }

        .sv-card--hovered .sv-card__title {
          color: #ffffff;
        }

        /* ── Description (hidden → shown on hover) ─────────────── */
        .sv-card__description {
          font-size: 0.82rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition:
            max-height 0.45s ease,
            opacity 0.4s ease,
            margin-bottom 0.35s ease;
          margin-bottom: 0;
        }

        .sv-card--hovered .sv-card__description {
          max-height: 8rem;
          opacity: 1;
          margin-bottom: 1rem;
        }

        /* ── Product image area ────────────────────────────────── */
        .sv-card__image-wrap {
          position: relative;
          flex: 1;
          width: 100%;
          /* Collapses on hover to give room to description */
          min-height: 10rem;
          max-height: 14rem;
          transition:
            max-height 0.45s ease,
            opacity 0.4s ease,
            min-height 0.45s ease;
          opacity: 1;
        }

        .sv-card--hovered .sv-card__image-wrap {
          max-height: 0;
          min-height: 0;
          opacity: 0;
          overflow: hidden;
        }

        .sv-card__image {
          transition: transform 0.4s ease;
        }

        /* ── View More link ────────────────────────────────────── */
        .sv-card__link {
          display: inline-flex;
          align-items: center;
          font-size: 0.82rem;
          font-weight: 600;
          color: #1a56e8;
          text-decoration: none;
          margin-top: auto;
          padding-top: 1rem;
          transition:
            color 0.35s ease,
            letter-spacing 0.3s ease;
          letter-spacing: 0;
        }

        .sv-card__link:hover {
          letter-spacing: 0.03em;
        }

        .sv-card--hovered .sv-card__link {
          color: #ffffff;
        }
      `}</style>
        </section>
    );
}
