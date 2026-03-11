"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import Link from "next/link";
const propertyTypes = [
    { label: "All", value: "" },
    { label: "Apartment", value: "apartment" },
    { label: "Villa", value: "villa" },
    { label: "House", value: "independent_house" },
    { label: "Plot", value: "plot" },
    { label: "Commercial", value: "commercial" },
];

export function PropertySearch() {
    const [query, setQuery] = useState("");
    const [activeType, setActiveType] = useState("");
    const router = useRouter();

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        if (activeType) params.set("type", activeType);
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="w-full max-w-2xl space-y-3">
            {/* Type Pills */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {propertyTypes.map((t) => (
                    <button
                        key={t.value}
                        onClick={() => setActiveType(t.value)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 cursor-pointer ${activeType === t.value
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2.5 shadow-sm focus-within:border-primary/40 focus-within:shadow-md focus-within:shadow-primary/5 transition-all duration-200">
                <Search size={18} className="text-muted-foreground flex-shrink-0" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search by locality, landmark, or project..."
                    className="flex-1 border-0 outline-none text-sm text-foreground bg-transparent placeholder:text-muted-foreground min-w-0"
                />
                <button
                    onClick={handleSearch}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-lg transition-colors flex-shrink-0 shadow-sm"
                >
                    Search <ArrowRight size={14} />
                </button>
            </div>

            {/* Quick Link */}
            <div className="flex justify-center">
                <Link
                    href="/properties/new"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                    Or <span className="font-medium underline underline-offset-2">list your property</span> →
                </Link>
            </div>
        </div>
    );
}
