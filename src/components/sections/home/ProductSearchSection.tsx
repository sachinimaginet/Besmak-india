"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductSearchSection() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (query.trim()) {
            router.push(`/products?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <section className="bg-[#6a92c2] py-16 text-white font-body">
            <div className="container mx-auto px-4 max-w-7xl">
                <h2 className="text-3xl md:text-4xl font-serif mb-8 text-white/95">
                    Search by product name or number.
                </h2>

                <form
                    onSubmit={handleSearch}
                    className="flex flex-col md:flex-row gap-4 items-stretch mb-6"
                >
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="What Are You Looking For ?"
                            className="w-full h-14 px-6 rounded-md bg-white text-gray-800 text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-body"
                        />
                    </div>
                    <button
                        type="submit"
                        className="h-14 px-10 bg-[#00c853] hover:bg-[#00b94c] text-white font-bold text-lg rounded-md transition-colors active:scale-[0.98]"
                    >
                        Search
                    </button>
                </form>

                <Link
                    href="/e-catalog"
                    className="inline-block text-lg font-bold border-b-2 border-white/40 hover:border-white transition-all pb-0.5"
                >
                    View e-Catalog
                </Link>
            </div>
        </section>
    );
}
