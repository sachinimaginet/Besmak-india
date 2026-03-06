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

    // Duplicate events for seamless loop
    const displayEvents = [...events, ...events, ...events];

    return (
        <section className="ea-section py-8 bg-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl"
                    >
                        <span className="ea-caption font-serif">{caption}</span>
                        <h2 className="ea-title text-2xl md:text-[3rem] font-serif">{title}</h2>
                        <div className="w-20 h-1 bg-[#1a4fa0] mb-6 rounded-full" />
                        <p className="ea-description">{description}</p>
                    </motion.div>
                </div>

                {/* ── Marquee Gallery ── */}
                <div className="relative overflow-hidden w-full">
                    <motion.div
                        className="flex gap-4 md:gap-8"
                        animate={{
                            x: [0, -100 * events.length],
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: events.length * 5,
                                ease: "linear",
                            },
                        }}
                        style={{ width: "fit-content" }}
                    >
                        {displayEvents.map((event, index) => (
                            <div
                                key={`${event.id}-${index}`}
                                className="relative flex-shrink-0 w-[280px] md:w-[400px]"
                            >
                                <div className="ea-card aspect-square relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
                                    <Image
                                        src={event.image}
                                        alt={event.alt}
                                        fill
                                        className="object-contain p-4 transition-transform duration-700 hover:scale-105"
                                        sizes="(max-width: 640px) 280px, 400px"
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
                        ))}
                    </motion.div>
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
          text-transform: ;
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

        @media (max-width: 768px) {
          .ea-title {
            font-size: 1.75rem;
          }
          .ea-description {
            font-size: 0.95rem;
          }
        }
      `}</style>
        </section>
    );
}
