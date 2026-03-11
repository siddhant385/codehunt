"use client";

import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";

interface GlobeProps {
    className?: string;
    opacity?: number;
}

export default function Globe({ className = "", opacity = 0.15 }: GlobeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointerInteracting = useRef<number | null>(null);
    const pointerInteractionMovement = useRef(0);
    const globeContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let globe: any;
        let phi = 0;
        let currentWidth = 0;
        let currentHeight = 0;

        const onResize = () => {
            if (globeContainerRef.current) {
                currentWidth = globeContainerRef.current.offsetWidth;
                currentHeight = globeContainerRef.current.offsetHeight;
            }
        };
        window.addEventListener('resize', onResize);
        onResize();

        const isMobile = window.innerWidth < 768;

        let dpr = 2;
        if (typeof window !== 'undefined') {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
        }

        if (canvasRef.current && currentWidth > 0) {
            globe = createGlobe(canvasRef.current, {
                devicePixelRatio: dpr,
                width: currentWidth * dpr,
                height: currentHeight * dpr,
                phi: 0,
                theta: 0.3,
                dark: 1, // dark mode colors
                diffuse: 1.2,
                mapSamples: isMobile ? 8000 : 12000,
                mapBrightness: 6,
                baseColor: [0.15, 0.15, 0.25], // Slightly lighter Indigo-tinted dark base
                markerColor: [0.1, 0.8, 1], // Cyan markers
                glowColor: [0.3, 0.4, 0.9], // Slightly brighter Indigo glow
                markers: [
                    // A few random markers for aesthetics
                    { location: [37.7595, -122.4367], size: 0.05 },
                    { location: [40.7128, -74.006], size: 0.04 },
                    { location: [28.6139, 77.209], size: 0.06 },
                    { location: [51.5074, -0.1278], size: 0.04 },
                ],
                onRender: (state) => {
                    // Called on every animation frame.
                    if (!pointerInteracting.current) {
                        // Called every frame to rotate automatically
                        phi += 0.003;
                    }
                    state.phi = phi + pointerInteractionMovement.current;
                    state.width = currentWidth * dpr;
                    state.height = currentHeight * dpr;
                },
            });
        }

        return () => {
            window.removeEventListener('resize', onResize);
            if (globe) {
                globe.destroy();
            }
        };
    }, []);

    return (
        <div
            ref={globeContainerRef}
            className={`w-[350px] sm:w-[450px] md:w-[600px] lg:w-[600px] xl:w-[600px] max-w-[100vw] aspect-square flex items-center justify-center pointer-events-none fade-in overflow-hidden ${className}`}
            style={{ opacity, mixBlendMode: "screen" }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    contain: "layout paint size",
                }}
            />
        </div>
    );
}
