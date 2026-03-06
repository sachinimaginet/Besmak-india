"use client";

import Image from "next/image";

interface TextImageSectionProps {
    content?: {
        header?: string;
        title?: string;
        description?: string;
        imageUrl?: string;
        imagePosition?: "left" | "right";
        bgColor?: string;
    };
}

export default function TextImageSection({ content }: TextImageSectionProps) {
    const {
        title = "Modern Manufacturing. Precision Engineering. Proven Legacy.",
        description = "For over 30 years, Besmak has supported India's industrial growth\nthrough innovation, quality and resilience. Rooted in India with a\nglobal outlook, we continue to adapt to evolving manufacturing\nneeds while contributing to the spirit of Make in India, backed by\nstrong engineering expertise and trusted industry partnerships.",
        imageUrl = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070",
        imagePosition = "right",
        bgColor = "bg-white",
    } = content || {};

    return (
        <section className={`py-12 ${bgColor}`}>
            <div className="container mx-auto px-4 max-w-7xl">

                <div
                    className={`flex flex-col ${imagePosition === "left" ? "md:flex-row-reverse" : "md:flex-row"
                        } items-center gap-10 md:gap-16 lg:gap-24`}
                >
                    <div className="flex-1 flex justify-center md:justify-start">
                        <p className="text-lg md:text-xl text-gray-800 leading-relaxed text-justify whitespace-pre-line">
                            {description.split(/\\n|\n/g).map((line, index, array) => (
                                <span key={index}>
                                    {line}
                                    {index < array.length - 1 && <br />}
                                </span>
                            ))}
                        </p>
                    </div>

                    <div className="flex-1 w-full flex justify-center md:justify-end">
                        <div className="relative w-full aspect-[6/3] max-w-[400px]">
                            <Image
                                src={imageUrl}
                                alt={title}
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
                {/* Main Title atop the layout */}
                <h2 className="text-center font-bold text-gray-900 leading-[1.1] text-2xl md:text-3xl lg:text-4xl mt-10">
                    {title.split('. ').map((part, i, arr) => (
                        <span key={i} className="block md:inline">
                            {part}{i < arr.length - 1 ? '. ' : ''}
                        </span>
                    ))}
                </h2>
            </div>
        </section>
    );
}
