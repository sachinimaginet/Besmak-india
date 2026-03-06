"use client";

import React, { useEffect, useRef, useState } from "react";
import { History, Users, Target, Cog } from "lucide-react";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useInView,
    useMotionValue,
    animate,
    AnimatePresence
} from "framer-motion";

interface StatsSectionProps {
    content?: {
        stat1_value?: string;
        stat1_label?: string;
        stat1_icon?: string;
        stat2_value?: string;
        stat2_label?: string;
        stat2_icon?: string;
        stat3_value?: string;
        stat3_label?: string;
        stat3_icon?: string;
        stat4_value?: string;
        stat4_label?: string;
        stat4_icon?: string;
        bgColor?: string;
    };
}

const IconMap: Record<string, any> = {
    history: History,
    users: Users,
    target: Target,
    cog: Cog,
};

// --- Sub-components for Premium Effects ---

function Counter({ value }: { value: string }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });
    const [displayValue, setDisplayValue] = useState("0");

    useEffect(() => {
        if (!inView) return;

        const match = value.match(/(\d+(\.\d+)?)(.*)/);
        if (!match) {
            setDisplayValue(value);
            return;
        }

        const target = parseFloat(match[1]);
        const suffix = match[3] || "";
        const isDecimal = match[1].includes(".");

        const controls = animate(0, target, {
            duration: 2.5,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (latest) => {
                const formatted = isDecimal ? latest.toFixed(1) : Math.round(latest).toString();
                setDisplayValue(formatted + suffix);
            }
        });

        return () => controls.stop();
    }, [inView, value]);

    return <span ref={ref}>{displayValue}</span>;
}

function StatCard({ item, index }: { item: any, index: number }) {
    const Icon = IconMap[item.icon] || History;
    const cardRef = useRef<HTMLDivElement>(null);

    // 3D Tilt Values
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [15, -15]);
    const rotateY = useTransform(x, [-100, 100], [-15, 15]);

    // Spring options for smoothness
    const springConfig = { damping: 20, stiffness: 150 };
    const springRotateX = useSpring(rotateX, springConfig);
    const springRotateY = useSpring(rotateY, springConfig);

    // Magnetic Icon Values
    const iconX = useMotionValue(0);
    const iconY = useMotionValue(0);
    const springIconX = useSpring(iconX, springConfig);
    const springIconY = useSpring(iconY, springConfig);

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Tilt Calc
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);

        // Magnetic Icon Calc (subtler movement)
        iconX.set((event.clientX - centerX) * 0.2);
        iconY.set((event.clientY - centerY) * 0.2);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
        iconX.set(0);
        iconY.set(0);
    }


    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: 1000,
                rotateX: springRotateX,
                rotateY: springRotateY,
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex flex-col items-center text-center p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] bg-white/40 backdrop-blur-md border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] hover:shadow-[0_24px_64px_rgba(var(--primary-rgb),0.2)] transition-shadow duration-500"
        >
            <div className="mb-6 md:mb-8 relative">
                <motion.div
                    style={{ x: springIconX, y: springIconY }}
                    className="relative z-10 p-4 md:p-5 bg-primary/10 rounded-2xl md:rounded-3xl group-hover:bg-primary transition-colors duration-500"
                >
                    <Icon
                        className="w-10 h-10 md:w-16 md:h-16 text-primary group-hover:text-white transition-colors duration-500"
                        strokeWidth={1.2}
                    />
                </motion.div>
                {/* Dynamic Glow */}
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[20px] md:blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 scale-150" />
            </div>

            <h3 className="font-serif font-black text-2xl md:text-5xl text-primary mb-2 md:mb-4 leading-none tracking-tight">
                <Counter value={item.value} />
            </h3>

            <p className="text-gray-600 font-serif font-semibold text-xs md:text-lg leading-relaxed max-w-[140px] md:max-w-[220px] group-hover:text-primary transition-colors duration-300">
                {item.label}
            </p>

            {/* Glass decoration for desktop */}
            {index < 3 && (
                <div className="hidden lg:block absolute -right-8 top-1/2 -translate-y-1/2 w-[1px] h-32 bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
            )}
        </motion.div>
    );
}

// --- Main Component ---

export default function StatsSection({ content }: StatsSectionProps) {
    const {
        stat1_value = "30+",
        stat1_label = "Legacy & Experience",
        stat1_icon = "history",
        stat2_value = "460+",
        stat2_label = "Workforce Strength",
        stat2_icon = "users",
        stat3_value = "3.2 Million",
        stat3_label = "Production Capability",
        stat3_icon = "target",
        stat4_value = "Advanced",
        stat4_label = "Technology & Quality",
        stat4_icon = "cog",
        bgColor = "bg-white",
    } = content || {};

    const items = [
        { value: stat1_value, label: stat1_label, icon: stat1_icon },
        { value: stat2_value, label: stat2_label, icon: stat2_icon },
        { value: stat3_value, label: stat3_label, icon: stat3_icon },
        { value: stat4_value, label: stat4_label, icon: stat4_icon },
    ];

    return (
        <section className={`relative py-16 md:py-40 overflow-hidden ${bgColor}`}>
            {/* Premium Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/5 rounded-full blur-[80px] md:blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-primary/5 rounded-full blur-[100px] md:blur-[140px] animate-pulse [animation-delay:2s]" />

                {/* Animated Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-primary) 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <div className="container relative z-10 mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-2 lg:grid-cols-4 items-stretch justify-center gap-4 md:gap-14">
                    {items.map((item, index) => (
                        <StatCard key={index} item={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
