"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
<<<<<<< Updated upstream
import { Search, Mic, ChevronDown } from "lucide-react";

const tabs = [
    { label: "Buy", id: "buy" },
    { label: "Rent", id: "rent" },
    { label: "New Launch", id: "new-launch", dot: true },
    { label: "Commercial", id: "commercial" },
    { label: "Plots/Land", id: "plots-land" },
    { label: "Projects", id: "projects" },
];

=======
import { Search, ArrowRight } from "lucide-react";
import Link from "next/link";

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream

                {/* Spacer + divider + Post Property */}
                <div className="ml-auto flex items-center flex-shrink-0">
                    <div className="w-px h-5 bg-gray-200 mx-2" />
                    <button className="flex items-center gap-1.5 px-3 py-2 text-[13.5px] font-semibold text-[#003b6f] bg-transparent border-0 cursor-pointer whitespace-nowrap">
                        Post Property
                        <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide">
                            FREE
                        </span>
                    </button>
                </div>
            </div>

            {/* ── Search Row ── */}
            <div className="flex items-center gap-2 px-3 py-2.5 relative">
                {/* Property Type Dropdown */}
                <div className="relative flex-shrink-0">
                    <button
                        onClick={() => setDropdownOpen((p) => !p)}
                        className="flex items-center gap-1.5 px-2 py-1.5 text-[13.5px] font-medium text-gray-700 bg-transparent border-0 cursor-pointer whitespace-nowrap hover:text-[#003b6f] transition-colors"
                    >
                        <span>{propertyType}</span>
                        <ChevronDown size={14} className="text-gray-400" />
                    </button>

                    {dropdownOpen && (
                        <ul className="absolute top-full left-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] list-none p-1.5 m-0 min-w-[170px] z-50">
                            {propertyTypes.map((type) => (
                                <li key={type}>
                                    <button
                                        onClick={() => {
                                            setPropertyType(type);
                                            setDropdownOpen(false);
                                        }}
                                        className={[
                                            "block w-full px-4 py-2 text-[13.5px] text-left bg-transparent border-0 cursor-pointer rounded-lg transition-colors",
                                            propertyType === type
                                                ? "text-[#003b6f] font-semibold"
                                                : "text-gray-600 hover:bg-blue-50 hover:text-[#003b6f]",
                                        ].join(" ")}
                                    >
                                        {type}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Vertical divider */}
                <div className="w-px h-5 bg-gray-200 flex-shrink-0" />

                {/* Search icon */}
                <Search size={18} className="text-gray-400 flex-shrink-0 ml-1" />

                {/* Search input */}
=======
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2.5 shadow-sm focus-within:border-primary/40 focus-within:shadow-md focus-within:shadow-primary/5 transition-all duration-200">
                <Search size={18} className="text-muted-foreground flex-shrink-0" />
>>>>>>> Stashed changes
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
