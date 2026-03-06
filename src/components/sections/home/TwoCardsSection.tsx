"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* ── Types ─────────────────────────────────────────────────────── */

interface CardContent {
    title: string;
    description: string;
    link: string;
    buttonText: string;
}

interface TwoCardsSectionProps {
    content?: {
        leftCard?: string;  // JSON string of CardContent
        rightCard?: string; // JSON string of CardContent
    };
}

/* ── Default Data ────────────────────────────────────────────── */

const DEFAULT_LEFT: CardContent = {
    title: "CSR Activities",
    description: "At Besmak, we believe that true progress goes beyond manufacturing excellence. While we are proud to contribute to the automobile component industry through high-quality connectors, terminals and precision components, we also remain deeply committed to giving back to the community that supports our growth.\n\nWe strongly believe that responsible business is built on compassion, sustainability and shared growth. Through continuous CSR initiatives, Besmak strives to build healthier communities, support those in need and contribute towards a better tomorrow.",
    link: "/csr",
    buttonText: "Read More"
};

const DEFAULT_RIGHT: CardContent = {
    title: "Career Opportunities at Besmak",
    description: "At Besmak, we believe our people are the driving force behind everything we achieve. We are committed to building a workplace where talent is valued, growth is encouraged and every individual has the opportunity to make a meaningful impact.\n\nWhether you are an experienced professional or a passionate fresher ready to begin your journey, Besmak offers a supportive environment that promotes learning, teamwork and long-term career development.\n\nJoin us and be a part of a company where innovation, responsibility and shared success go hand in hand.",
    link: "/careers",
    buttonText: "Join Us"
};

/* ── Component ─────────────────────────────────────────────────── */

export default function TwoCardsSection({ content }: TwoCardsSectionProps) {
    const parseSafe = (data: any, fallback: CardContent): CardContent => {
        if (!data || typeof data !== 'string') return fallback;
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error("Error parsing card data:", e);
            return fallback;
        }
    };

    const leftData = parseSafe(content?.leftCard, DEFAULT_LEFT);
    const rightData = parseSafe(content?.rightCard, DEFAULT_RIGHT);

    return (
        <section className="tc-section py-10 bg-[#646c77]">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* ── Left Card (CSR) ── */}
                    <div className="tc-card tc-card-beige">
                        <div className="tc-blob-top-right"></div>
                        <div className="tc-content relative z-10">
                            <h2 className="tc-title">{leftData.title}</h2>
                            <div className="tc-description">
                                {leftData.description.split('\n\n').map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                            <Link href={leftData.link} className="tc-btn-link group/btn">
                                <button className="flex items-center gap-2 bg-white text-[#1a4fa0] px-6 py-3 rounded-md font-bold shadow-md transform transition-all duration-300 group-hover/btn:scale-105 group-hover/btn:shadow-xl group-hover/btn:bg-[#1a4fa0] group-hover/btn:text-white">
                                    {leftData.buttonText} <ArrowRight className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover/btn:translate-x-1" />
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* ── Right Card (Careers) ── */}
                    <div className="tc-card tc-card-white">
                        <div className="tc-blob-bottom-left"></div>
                        <div className="tc-content relative z-10">
                            <h2 className="tc-title">{rightData.title}</h2>
                            <div className="tc-description">
                                {rightData.description.split('\n\n').map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                            <Link href={rightData.link} className="tc-btn-link group/btn">
                                <button className="flex items-center gap-2 bg-white text-[#1a4fa0] px-6 py-3 rounded-md font-bold shadow-md transform transition-all duration-300 group-hover/btn:scale-105 group-hover/btn:shadow-xl group-hover/btn:bg-[#1a4fa0] group-hover/btn:text-white">
                                    {rightData.buttonText} <ArrowRight className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover/btn:translate-x-1" />
                                </button>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>

            <style jsx>{`
                .tc-section {
                    background-color: #646c77;
                }

                .tc-card {
                    position: relative;
                    padding: 4rem 3.5rem;
                    border-radius: 2.5rem;
                    overflow: hidden;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .tc-card-beige {
                    background-color: #f5f1ea;
                    color: #111827;
                }

                .tc-card-white {
                    background-color: #ffffff;
                    color: #111827;
                }

                /* Decorative Blobs */
                .tc-blob-top-right {
                    position: absolute;
                    top: -6rem;
                    right: -6rem;
                    width: 12rem;
                    height: 12rem;
                    background: radial-gradient(circle, rgba(214, 210, 210, 1) 0%, rgba(208, 212, 218, 0.4) 60%, transparent 100%);
                    border-radius: 50%;
                    filter: blur(20px);
                    z-index: 1;
                }

                .tc-blob-bottom-left {
                    position: absolute;
                    bottom: -5rem;
                    left: -5rem;
                    width: 12rem;
                    height: 12rem;
                    background-color: #f3efdf;
                    border-radius: 50%;
                    z-index: 1;
                }

                .tc-title {
                    font-family: var(--font-heading), serif;
                    font-size: 2.5rem;
                    font-weight: 400;
                    margin-bottom: 2rem;
                    line-height: 1.1;
                    min-height: 5.5rem;
                    display: flex;
                    align-items: flex-end;
                }

                .tc-content {
                    position: relative;
                    z-index: 10;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }

                .tc-description {
                    font-size: 1rem;
                    line-height: 1.6;
                    color: #4b5563;
                    margin-bottom: 3.5rem;
                    flex-grow: 1;
                }

                .tc-description p {
                    margin-bottom: 1.25rem;
                }

                /* Buttons */
                .tc-btn-link {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.75rem 1.5rem;
                    border-radius: 9999px;
                    background-color: #fff;
                    color: #1a4fa0;
                    font-weight: 600;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
                    transition: all 0.2s ease;
                    width: fit-content;
                    border: 1px solid #f3f4f6;
                }
                .tc-btn-link:hover {
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
                    transform: translateX(4px);
                    border-color: #e5e7eb;
                }

                @media (max-width: 1024px) {
                    .tc-card {
                        padding: 3rem 2.5rem;
                    }
                    .tc-title {
                        font-size: 2rem;
                    }
                }

                @media (max-width: 640px) {
                    .tc-card {
                        padding: 2.5rem 1.5rem;
                        border-radius: 1.5rem;
                    }
                }
            `}</style>
        </section>
    );
}
