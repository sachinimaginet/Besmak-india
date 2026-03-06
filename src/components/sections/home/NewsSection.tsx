"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface NewsItem {
    title: string;
    description?: string;
    link: string;
}

interface NewsImage {
    url: string;
    title: string;
    date?: string;
}

interface NewsSectionProps {
    content?: {
        title?: string;
        newsItems?: NewsItem[];
        featuredBoxText?: string;
        images?: NewsImage[];
    };
}

const defaultNewsItems: NewsItem[] = [
    {
        title: "Strong Manufacturing Expertise",
        description: "Besmak is a globally preferred manufacturer specializing in automobile connection systems, wiring harness components, precision plastic parts, stamping tools, and injection moulds, supported by advanced manufacturing technologies.",
        link: "#"
    },
    {
        title: "High Production Capability",
        description: "The company has the capacity to produce over 3.2 million parts per day, supported by automated assembly lines, precision tooling, and digitally controlled manufacturing systems.",
        link: "#"
    },
    {
        title: "Trusted by Global Automotive Clients",
        description: "Besmak is a preferred partner for OEMs and plays a key role in the automotive wiring harness supply chain, providing high-quality and reliable components.",
        link: "#"
    },
];

const defaultImages: NewsImage[] = [
    {
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070",
        title: "Infosys Q3 FY26 Results - Archived Webcast",
        date: "January 14, 2026",
    },
    {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069",
        title: "The Future of Work 2023 Report",
    },
    {
        url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2070",
        title: "ESG is a business necessity, and offers short-term financial benefits now",
    },
    {
        url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=2070",
        title: "Why are enterprises moving their applications to the cloud? – An Infosys research",
    },
];

export default function NewsSection({ content }: NewsSectionProps) {
    const {
        title = "Key Highlights of Besmak",
        newsItems = defaultNewsItems,
        featuredBoxText = "Besmak continues to achieve major milestones through technology upgrades, new product developments, automation, ESG initiatives, and global certifications, positioning itself as a future-ready manufacturing company.",
        images = defaultImages,
    } = content || {};

    return (
        <section className="bg-white py-0">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col lg:flex-row min-h-[600px] shadow-xl rounded-2xl overflow-hidden">
                    {/* Left Side: News List */}
                    <div className="lg:w-1/3 bg-primary p-8 md:p-12 flex flex-col justify-between text-white">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-8 tracking-tight">
                                {title}
                            </h2>

                            <div className="space-y-6">
                                {newsItems.map((item, index) => (
                                    <a
                                        key={index}
                                        href={item.link}
                                        className="group flex items-start justify-between gap-4 border-b border-white/20 pb-4 hover:border-white transition-colors"
                                    >
                                        <div className="space-y-2">
                                            <p className="text-base md:text-lg font-bold leading-tight group-hover:text-white transition-colors">
                                                {item.title}
                                            </p>
                                            {item.description && (
                                                <p className="text-sm text-white/80 leading-snug font-medium line-clamp-3 group-hover:text-white transition-colors">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                        <ArrowRight className="w-5 h-5 flex-shrink-0 mt-1 transform group-hover:translate-x-1 transition-transform" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="mt-10 bg-black/20 p-6 rounded-xl">
                            <p className="text-base md:text-lg font-bold leading-tight">
                                {featuredBoxText}
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Image Grid Collage */}
                    <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 bg-gray-100">
                        {images.slice(0, 4).map((image, index) => (
                            <div key={index} className="relative group overflow-hidden aspect-video md:aspect-square lg:aspect-auto h-full min-h-[300px]">
                                <Image
                                    src={image.url}
                                    alt={image.title}
                                    fill
                                    className="object-cover"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8">
                                    <div className="space-y-2">
                                        <h3 className="text-lg md:text-xl font-bold text-white leading-tight group-hover:text-blue-200 transition-colors">
                                            {image.title}
                                        </h3>
                                        {image.date && (
                                            <p className="text-xs font-semibold text-white/60 tracking-wider">
                                                {image.date.toUpperCase()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
