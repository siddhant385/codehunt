"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, BedDouble, ArrowRight } from "lucide-react";
import type { Property } from "@/lib/schema/property.schema";

const SCROLL_AMOUNT = 320;

const typeEmoji: Record<string, string> = {
    apartment: "🏢",
    villa: "🏡",
    plot: "🌳",
    commercial: "🏪",
    independent_house: "🏠",
};

export function NewlyLaunched({ properties }: { properties: Property[] }) {
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
            </div>
        </section>
    );
}
