"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
<<<<<<< Updated upstream

import { Tag, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";

type BadgeType = "NEW LAUNCH" | "NEW ARRIVAL";

interface Project {
    id: number;
    badge: BadgeType;
    image: string;
    name: string;
    location: string;
    priceRange: string;
    config: string;
    certifications: string[];
    extraInfo: string;
    extraInfoGreen?: boolean;
}

const projects: Project[] = [
    {
        id: 1,
        badge: "NEW LAUNCH",
        image:
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=120&h=120&fit=crop",
        name: "Smartworld Residences by ...",
        location: "Sector 98, Noida",
        priceRange: "₹1.91 - 11.43 Cr",
        config: "1, 2, 3, 4 BHK A...",
        certifications: ["RERA"],
        extraInfo: "Completion in Oct, 2030",
        extraInfoGreen: false,
    },
    {
        id: 2,
        badge: "NEW LAUNCH",
        image:
            "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=120&h=120&fit=crop",
        name: "Purva Silversky",
        location: "Electronic City, Bangalore",
        priceRange: "₹2.3 - 6.66 Cr",
        config: "3, 4, 5 BHK Apart...",
        certifications: ["RERA"],
        extraInfo: "8.7% price increase in last 3 months in ...",
        extraInfoGreen: true,
    },
    {
        id: 3,
        badge: "NEW ARRIVAL",
        image:
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=120&h=120&fit=crop",
        name: "Urban Lakes Pha...",
        location: "Konnagar, Hooghly",
        priceRange: "₹52.33 - 72.77 L",
        config: "2, 3 BHK Apartments",
        certifications: ["RERA", "HIRA"],
        extraInfo: "8.0% price increase in last ...",
        extraInfoGreen: true,
    },
    {
        id: 4,
        badge: "NEW LAUNCH",
        image:
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=120&h=120&fit=crop",
        name: "Godrej Reserve",
        location: "Kandivali East, Mumbai",
        priceRange: "₹3.5 - 9.2 Cr",
        config: "2, 3, 4 BHK Apart...",
        certifications: ["RERA"],
        extraInfo: "Completion in Dec, 2028",
        extraInfoGreen: false,
    },
];

const badgeColors: Record<BadgeType, string> = {
    "NEW LAUNCH": "bg-amber-400 text-amber-900",
    "NEW ARRIVAL": "bg-blue-400 text-blue-900",
};
=======
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, BedDouble, ArrowRight } from "lucide-react";
import type { Property } from "@/lib/schema/property.schema";

const SCROLL_AMOUNT = 320;
>>>>>>> Stashed changes

const typeEmoji: Record<string, string> = {
    apartment: "🏢",
    villa: "🏡",
    plot: "🌳",
    commercial: "🏪",
    independent_house: "🏠",
};

export function NewlyLaunched() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const updateScrollState = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        updateScrollState();
        el.addEventListener("scroll", updateScrollState, { passive: true });
        return () => el.removeEventListener("scroll", updateScrollState);
    }, [updateScrollState]);

    if (properties.length === 0) return null;

    return (
        <section className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-xl font-bold text-foreground">
                        Newly Listed
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Fresh properties just added to the platform
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => scrollRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" })}
                        aria-label="Scroll left"
                        className={`w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-muted transition-all ${canScrollLeft ? "opacity-100" : "opacity-30 pointer-events-none"
                            }`}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={() => scrollRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" })}
                        aria-label="Scroll right"
                        className={`w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-muted transition-all ${canScrollRight ? "opacity-100" : "opacity-30 pointer-events-none"
                            }`}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Scrollable Cards */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
            >
                {properties.map((p) => {
                    const emoji = typeEmoji[p.property_type ?? ""] ?? "🏠";
                    const price = p.asking_price
                        ? `₹${Number(p.asking_price).toLocaleString("en-IN")}`
                        : "Price on Request";
                    const config = [
                        p.bedrooms ? `${p.bedrooms} BHK` : null,
                        p.area_sqft ? `${p.area_sqft} sqft` : null,
                    ]
                        .filter(Boolean)
                        .join(" · ");

<<<<<<< Updated upstream
                {/* Right Arrow */}
                <button
                    onClick={scrollRight}
                    aria-label="Scroll right"
                    className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 bg-card rounded-full shadow-md border border-border flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200 ${canScrollRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                        }`}
                >
                    <ChevronRight size={18} />
                </button>

                {/* Scrollable Cards */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
                >
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="flex-shrink-0 w-[290px] bg-card rounded-xl shadow-sm border border-border flex flex-col overflow-hidden"
                        >
                            {/* Badge */}
                            <div className="px-3 pt-3 pb-0">
                                <span
                                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${badgeColors[project.badge]}`}
                                >
                                    {project.badge}
                                </span>
                            </div>

                            {/* Main Info */}
                            <div className="flex gap-3 p-3">
                                {/* Circular Image */}
                                <div className="flex-shrink-0 relative">
                                    <img
                                        src={project.image}
                                        alt={project.name}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-border"
                                    />
                                    {/* RERA / HIRA badges on image */}
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                        {project.certifications.map((cert) => (
                                            <span
                                                key={cert}
                                                className="flex items-center gap-0.5 bg-primary text-primary-foreground text-[8px] font-bold px-1 py-0.5 rounded"
                                            >
                                                <ShieldCheck size={8} />
                                                {cert}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Text Details */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-card-foreground truncate leading-snug">
                                        {project.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                        {project.location}
                                    </p>
                                    <p className="text-sm font-semibold text-foreground mt-1.5">
                                        {project.priceRange}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {project.config}
                                    </p>
                                    <p
                                        className={`text-xs mt-1 truncate ${project.extraInfoGreen
                                            ? "text-green-600 font-medium"
                                            : "text-muted-foreground"
                                            }`}
                                    >
                                        {project.extraInfoGreen ? "" : "🕐 "}
                                        {project.extraInfo}
                                    </p>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-border mx-3" />

                            {/* Footer */}
                            <div className="flex items-center justify-between px-3 py-2.5 gap-2">
                                <div className="flex items-center gap-1.5 text-xs text-primary font-medium flex-shrink-0">
                                    <Tag size={12} className="flex-shrink-0" />
                                    <span className="leading-tight">
                                        Get preferred options
                                        <br />
                                        @zero brokerage
                                    </span>
                                </div>
                                <button className="flex-shrink-0 px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground text-xs font-semibold rounded-lg border-0 cursor-pointer transition-opacity whitespace-nowrap">
                                    View Number
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
=======
                    return (
                        <Link
                            key={p.id}
                            href={`/properties/${p.id}`}
                            className="flex-shrink-0 w-[280px] group"
                        >
                            <div className="bg-card rounded-xl border border-border overflow-hidden card-hover h-full flex flex-col">
                                {/* Image/Emoji area */}
                                <div className="h-36 bg-gradient-to-br from-primary/8 via-accent/5 to-chart-2/8 flex items-center justify-center relative">
                                    <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                                        {emoji}
                                    </span>
                                    <span className="absolute top-3 left-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-chart-2/15 text-chart-2 border border-chart-2/20 uppercase tracking-wider">
                                        New
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-4 flex-1 flex flex-col gap-1.5">
                                    <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                        {p.title || "Untitled Property"}
                                    </h3>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <MapPin size={11} />
                                        {p.city || "Unknown"}, {p.state || ""}
                                    </p>
                                    <p className="text-base font-bold text-foreground mt-1">
                                        {price}
                                    </p>
                                    {config && (
                                        <p className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                                            {p.bedrooms && <BedDouble size={11} />}
                                            {config}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-1 mt-auto pt-2 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        View Details <ArrowRight size={11} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
>>>>>>> Stashed changes
            </div>
        </section>
    );
}
