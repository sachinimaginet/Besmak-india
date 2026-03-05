"use client";

import { useState, useEffect } from "react";
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

    const [page, setPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);

    // Responsive items per page
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setItemsPerPage(1);
            else if (window.innerWidth < 1024) setItemsPerPage(2);
            else setItemsPerPage(3);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const totalPages = Math.ceil(events.length / itemsPerPage);

    const nextSlide = () => {
        setPage((prev) => (prev + 1) % totalPages);
    };

    const prevSlide = () => {
        setPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    // Auto cycling
    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [totalPages]);

    // Get current set of images
    const getCurrentItems = () => {
        const start = page * itemsPerPage;
        return events.slice(start, start + itemsPerPage);
    };

    return (
        <section className="ea-section py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl"
                    >
                        <span className="ea-caption">{caption}</span>
                        <h2 className="ea-title">{title}</h2>
                        <div className="w-20 h-1 bg-[#1a4fa0] mb-6 rounded-full" />
                        <p className="ea-description">{description}</p>
                    </motion.div>

                    <div className="flex gap-4">
                        <button
                            onClick={prevSlide}
                            className="ea-nav-btn group"
                            aria-label="Previous set"
                        >
                            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="ea-nav-btn group"
                            aria-label="Next set"
                        >
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* ── Fade Gallery ── */}
                <div className="relative min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={page}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {getCurrentItems().map((event, index) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="relative group"
                                >
                                    <div className="ea-card aspect-square relative rounded-2xl overflow-hidden p-6 flex items-center justify-center">
                                        <Image
                                            src={event.image}
                                            alt={event.alt}
                                            fill
                                            className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />

                                        {event.href && (
                                            <a
                                                href={event.href}
                                                className="absolute inset-0 z-10"
                                                aria-label={event.alt}
                                            />
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {/* Page Indicator dots */}
                    <div className="flex justify-center mt-12 gap-3">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === page ? "w-8 bg-[#1a4fa0]" : "w-1.5 bg-gray-200"
                                    }`}
                                aria-label={`Go to page ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .ea-caption {
          display: block;
          font-size: 0.9rem;
          font-weight: 700;
          color: #1a4fa0;
          letter-spacing: 0.15em;
          margin-bottom: 1rem;
          text-transform: uppercase;
        }

        .ea-title {
          font-size: 3rem;
          font-weight: 800;
          color: #111827;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .ea-description {
          font-size: 1.1rem;
          color: #4b5563;
          line-height: 1.7;
          max-width: 550px;
        }

        .ea-nav-btn {
          width: 3.5rem;
          height: 3.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e5e7eb;
          border-radius: 99px;
          color: #4b5563;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: white;
        }

        .ea-nav-btn:hover {
          border-color: #1a4fa0;
          color: #1a4fa0;
          background: #f0f7ff;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .ea-title {
            font-size: 2.25rem;
          }
        }
      `}</style>
        </section>
    );
}
