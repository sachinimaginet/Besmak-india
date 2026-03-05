"use client";

import { History, Users, Target, Cog } from "lucide-react";

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
        <section className={`py-12 ${bgColor}`}>
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col md:flex-row items-stretch justify-between gap-8 md:gap-0">
                    {items.map((item, index) => {
                        const Icon = IconMap[item.icon] || History;
                        return (
                            <div
                                key={index}
                                className={`flex-1 flex flex-col items-center text-center px-4 ${index !== items.length - 1 ? "md:border-r border-gray-300" : ""
                                    }`}
                            >
                                <div className="mb-6">
                                    <Icon className="w-20 h-20 text-primary" strokeWidth={1.5} />
                                </div>
                                <h3 className="font-serif font-bold text-primary mb-2 leading-tight">
                                    {item.value}
                                </h3>
                                <p className="text-primary font-serif font-semibold text-sm md:text-base leading-relaxed">
                                    {item.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
