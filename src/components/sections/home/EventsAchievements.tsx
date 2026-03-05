"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ── Types ─────────────────────────────────────────────────────── */

interface EventCard {
    id: string;
    image: string;
    alt: string;
    href?: string;
}

interface EventsAchievementsProps {
    content?: {
        caption?: string;
        title?: string;
        description?: string;
        /** JSON string of EventCard[] */
        events?: string;
    };
}

/* ── Default Data ────────────────────────────────────────────── */

const DEFAULT_EVENTS: EventCard[] = [
    {
        id: "1",
        image: "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/010aa9891ca0236b2038780fccf4aad264fe9a19.png",
        alt: "Award ceremony",
    },
    {
        id: "2",
        image: "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/ec683279a3b519fe54c79d12a66e3005896d09e0.jpg",
        alt: "Exhibition stall",
    },
    {
        id: "3",
        image: "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/8a3654ddb1efe22b2260e1f580c0ede772b6d20f.jpg",
        alt: "Exhibition stall 2",
    },
    {
        id: "4",
        image: "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/3e4d3abaf2fffc1c2b91d96f126316977fff2d7c.jpg",
        alt: "Product showcase",
    },
    {
        id: "5",
        image: "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/Screenshot%202026-03-05%20h171425.png",
        alt: "Exhibition stall",
    },
    {
        id: "6",
        image: "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/Screenshot%202026-03-05%2017154425.png",
        alt: "Exhibition stall 2",
    }
];

/* ── Component ─────────────────────────────────────────────────── */

export default function EventsAchievements({ content }: EventsAchievementsProps) {
    const {
        caption = "COMPANY MILESTONES",
        title = "Events & Achievements",
        description = "Key milestones, celebrations, and initiatives highlighting our continued growth and commitment to excellence.",
        events: eventsJson,
    } = content || {};

    /* Parse events from JSON string */
    let events: EventCard[] = DEFAULT_EVENTS;
    if (eventsJson) {
        try {
            const parsed = JSON.parse(eventsJson);
            if (Array.isArray(parsed) && parsed.length > 0) events = parsed;
        } catch {
            /* ignore parse errors */
        }
    }

    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsToShow, setCardsToShow] = useState(4);

    // Responsive cards to show
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setCardsToShow(1.2);
            else if (window.innerWidth < 1024) setCardsToShow(2.5);
            else setCardsToShow(4);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const totalCards = events.length;
    const maxIndex = Math.max(0, totalCards - Math.floor(cardsToShow));

    const nextSlide = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    return (
        <section className="ea-section py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div className="max-w-2xl">
                        <span className="ea-caption">{caption}</span>
                        <h2 className="ea-title">{title}</h2>
                        <p className="ea-description">{description}</p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={prevSlide}
                            disabled={currentIndex === 0}
                            className="ea-nav-btn"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextSlide}
                            disabled={currentIndex >= maxIndex}
                            className="ea-nav-btn"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* ── Slider ── */}
                <div className="relative">
                    <motion.div
                        className="flex gap-6"
                        animate={{ x: `calc(-${currentIndex * (100 / (cardsToShow === 1.2 ? 1.2 : cardsToShow))}% - ${currentIndex * (24 * (cardsToShow - 1) / cardsToShow)}px)` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="flex-shrink-0"
                                style={{ width: `calc((100% - ${(Math.floor(cardsToShow) - 1) * 1.5}rem) / ${cardsToShow})` }}
                            >
                                <div className="ea-card group">
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:border-blue-200">
                                        <Image
                                            src={event.image}
                                            alt={event.alt}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 25vw"
                                        />
                                        {event.href && (
                                            <a
                                                href={event.href}
                                                className="absolute inset-0 z-10"
                                                aria-label={event.alt}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <style jsx>{`
        .ea-caption {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #1a4fa0;
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
          text-transform: uppercase;
        }

        .ea-title {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 2.75rem;
          font-weight: 400;
          color: #111827;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }

        .ea-description {
          font-size: 1.05rem;
          color: #4b5563;
          line-height: 1.6;
          max-width: 500px;
        }

        .ea-nav-btn {
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          color: #4b5563;
          transition: all 0.2s ease;
          background: white;
        }

        .ea-nav-btn:hover:not(:disabled) {
          border-color: #1a4fa0;
          color: #1a4fa0;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        .ea-nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .ea-card {
          width: 100%;
        }

        @media (max-width: 768px) {
          .ea-title {
            font-size: 2rem;
          }
        }
      `}</style>
        </section>
    );
}
