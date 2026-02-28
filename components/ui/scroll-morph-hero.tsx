"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring } from "framer-motion";

// --- Utility ---
// function cn(...inputs: ClassValue[]) {
//     return twMerge(clsx(inputs));
// }

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
    src: string;
    index: number;
    total: number;
    phase: AnimationPhase;
    target: { x: number; y: number; rotation: number; scale: number; opacity: number };
}

// --- FlipCard Component ---
const IMG_WIDTH = 60;  // Reduced from 100
const IMG_HEIGHT = 85; // Reduced from 140

function FlipCard({
    src,
    index,
    total,
    phase,
    target,
}: FlipCardProps) {
    return (
        <motion.div
            // Smoothly animate to the coordinates defined by the parent
            animate={{
                x: target.x,
                y: target.y,
                rotate: target.rotation,
                scale: target.scale,
                opacity: target.opacity,
            }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}

            // Initial style
            style={{
                position: "absolute",
                width: IMG_WIDTH,
                height: IMG_HEIGHT,
                transformStyle: "preserve-3d", // Essential for the 3D hover effect
                perspective: "1000px",
            }}
            className="cursor-pointer group"
        >
            <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ rotateY: 180 }}
            >
                {/* Front Face */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-gray-200"
                    style={{ backfaceVisibility: "hidden", willChange: "transform, opacity" }}
                >
                    <img
                        src={src}
                        alt={`hero-${index}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                        width={IMG_WIDTH}
                        height={IMG_HEIGHT}
                    />
                    <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
                </div>

                {/* Back Face */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-gray-900 flex flex-col items-center justify-center p-4 border border-gray-700"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <div className="text-center">
                        <p className="text-[8px] font-bold text-blue-400 uppercase tracking-widest mb-1">View</p>
                        <p className="text-xs font-medium text-white">Details</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// --- Main Hero Component ---
// Reduce images and complexity to improve performance
const TOTAL_IMAGES = 8;
const MAX_SCROLL = 3000; // kept for legacy mapping
const MAX_VIRTUAL_SCROLL = 600;
const SCROLL_SENSITIVITY = 120; // lower sensitivity

// Local Images from public folder
const IMAGES = [
    "/3U4A1815.jpg",
    "/3U4A1894.jpg",
    "/3U4A1905.jpg",
    "/3U4A8829.jpg",
    "/3U4A9420.jpg",
    "/DSC_0393.jpg",
    "/FLY 16.JPG",
    "/IMG_0515.jpg",
    "/IMG_0657.jpg",
    "/IMG_0691.jpg",
    "/IMG_0905.jpg",
    "/IMG_0910.jpg",
    "/IMG_0965.jpg",
    "/IMG_2341.jpg",
    "/IMG_2400.jpg",
    "/IMG_3188.JPG",
    "/IMG_3202.JPG",
    "/IMG_3514.JPG",
    "/IMG_3710.jpg",
    "/IMG_5014.jpg",
];

// Helper for linear interpolation
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export default function IntroAnimation() {
    // Disable intro animation on refresh: start in final phase
    const [introPhase, setIntroPhase] = useState<AnimationPhase>("circle");
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const bodyScrollPos = useRef<number | null>(null);
    // Virtual scroll removed for performance; rely on page scroll
    const [imagesLoaded] = useState(true);

    // Removed eager preloading of many images to reduce startup cost.

    // Lock/unlock helpers moved to component scope so other effects can call them
    // Removed virtual-scroll locking and pointer/wheel interception to reduce CPU and avoid heavy event handling.

    // --- Container Size ---
    useEffect(() => {
        if (!containerRef.current) return;

        const handleResize = () => {
            setContainerSize({
                width: containerRef.current!.offsetWidth,
                height: containerRef.current!.offsetHeight,
            });
        };

        window.addEventListener("resize", handleResize, { passive: true });
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // --- Page Scroll Logic ---
    const [pageScroll, setPageScroll] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            // Get scroll position relative to the hero section
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const scrollTop = Math.max(-rect.top, 0); // 0 when hero is at top, increases as you scroll down
            setPageScroll(scrollTop);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Map page scroll to morph progress (simple, performs well)
    const morphProgress = useMemo(
        () => Math.min(Math.max(pageScroll / 600, 0), 1),
        [pageScroll]
    );

    // For scrollRotate, use a similar mapping:
    const scrollRotateValue = Math.min(Math.max((pageScroll - 600) / (3000 - 600), 0), 1) * 360;
    const rotateValue = scrollRotateValue;

    // Intro sequence disabled — component renders in final state immediately.

    // --- Random Scatter Positions ---
    const scatterPositions = useMemo(() => {
        return IMAGES.slice(0, TOTAL_IMAGES).map(() => ({
            x: (Math.random() - 0.5) * 900,
            y: (Math.random() - 0.5) * 600,
            rotation: (Math.random() - 0.5) * 90,
            scale: 0.7,
            opacity: 0,
        }));
    }, []);

    // --- Render Loop (Manual Calculation for Morph) ---
    // `heroProgress` captures the initial scroll-driven hero animation (0..RELEASE_THRESHOLD).
    // We allow a small overshoot so the hero holds before normal page scroll resumes.
    const RELEASE_THRESHOLD = 1.2;
    const [heroProgress, setHeroProgress] = useState(0);
    const [rotateValueState, setRotateValue] = useState(0);
    const [parallaxValue, setParallaxValue] = useState(0);

    useEffect(() => {
        setRotateValue(rotateValue);
    }, [rotateValue]);

    // --- Content Opacity ---
    // Use a clipped visual progress (0..1) for rendering while `heroProgress` may exceed 1
    const visualsProgress = Math.min(heroProgress, 1);
    // Fade in content when arc is formed (visualsProgress > 0.8)
    const contentOpacity =
        visualsProgress <= 0.8 ? 0 :
        visualsProgress >= 1 ? 1 :
        (visualsProgress - 0.8) / 0.2;
    const contentY =
        visualsProgress <= 0.8 ? 20 :
        visualsProgress >= 1 ? 0 :
        20 - ((visualsProgress - 0.8) / 0.2) * 20;

    // Attach hero scroll intercept that consumes initial scroll to advance the hero animation
    useHeroScrollIntercept(containerRef, heroProgress, (v) => {
        if (typeof v === 'function') setHeroProgress(v as any);
        else setHeroProgress(v);
    });

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full bg-[#FAFAFA] overflow-hidden"
            tabIndex={-1}
            style={{ touchAction: "none" }} // Prevent mobile overscroll
        >
            {/* Loading State */}
            {!imagesLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#FAFAFA] z-50">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-sm text-gray-600 font-medium">Loading...</p>
                    </div>
                </div>
            )}
            
            {/* Container */}
            <div className="flex h-full w-full flex-col items-center justify-center perspective-1000">

                {/* Intro Text (Fades out) */}
                <div className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2">
                    <motion.h1
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={introPhase === "circle" && visualsProgress < 0.5 ? { opacity: 1 - visualsProgress * 2, y: 0, filter: "blur(0px)" } : { opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 1 }}
                        className="text-2xl font-medium tracking-tight text-gray-800 md:text-4xl"
                    >
                        Creative Skill.<br/> Business Intelligence.<br/> Selective Access.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={introPhase === "circle" && visualsProgress < 0.5 ? { opacity: 0.5 - visualsProgress } : { opacity: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="mt-4 text-xs font-bold tracking-[0.2em] text-gray-500"
                    >
                        SCROLL TO DISCOVER CREATINN ACADEMY
                    </motion.p>
                </div>

                {/* Arc Active Content (Fades in) */}
                <motion.div
                    style={{ opacity: contentOpacity, y: contentY }}
                    className="absolute top-[20%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
                >
                    <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 tracking-tight mb-4">
                        Where Creative Skills Meet Business Mastery
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 max-w-lg leading-relaxed">
                        CreatINN Academy is a selective institution for ambitious creators.<br className="hidden md:block" />
                        Earn access. Build skills. Become alumni. <span className="text-accent-gold font-bold">No hype. No shortcuts.</span>
                    </p>
                </motion.div>

                {/* Main Container */}
                <div className="relative flex items-center justify-center w-full h-full">
                    {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
                        let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

                        // 1. Intro Phases (Scatter -> Line)
                        if (introPhase === "scatter") {
                            target = scatterPositions[i];
                        } else if (introPhase === "line") {
                            const lineSpacing = 70; // Adjusted for smaller images (60px width + 10px gap)
                            const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
                            const lineX = i * lineSpacing - lineTotalWidth / 2;
                            target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
                        } else {
                            // 2. Circle Phase & Morph Logic

                            // Responsive Calculations
                            const isMobile = containerSize.width < 768;
                            const minDimension = Math.min(containerSize.width, containerSize.height);

                            // A. Calculate Circle Position
                            const circleRadius = Math.min(minDimension * 0.35, 350);

                            const circleAngle = (i / TOTAL_IMAGES) * 360;
                            const circleRad = (circleAngle * Math.PI) / 180;
                            const circlePos = {
                                x: Math.cos(circleRad) * circleRadius,
                                y: Math.sin(circleRad) * circleRadius,
                                rotation: circleAngle + 90,
                            };

                            // B. Calculate Bottom Arc Position
                            // "Rainbow" Arch: Convex up. Center is highest point.

                            // Radius:
                            const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
                            const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);

                            // Position:
                            const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25);
                            const arcCenterY = arcApexY + arcRadius;

                            // Spread angle:
                            const spreadAngle = isMobile ? 100 : 130;
                            const startAngle = -90 - (spreadAngle / 2);
                            const step = spreadAngle / (TOTAL_IMAGES - 1);

                            // Apply Scroll Rotation (Shuffle) with Bounds
                            // We want to clamp rotation so images don't disappear.
                            // Map scroll range [600, 3000] to a limited rotation range.
                            // Range: [-spreadAngle/2, spreadAngle/2] keeps them roughly in view.
                            // We map 0 -> 1 (progress of scroll loop) to this range.

                            // Note: rotateValue comes from smoothScrollRotate which maps [600, 3000] -> [0, 360]
                            // We need to adjust that mapping in the hook above, OR adjust it here.
                            // Better to adjust it here relative to the spread.

                            // Let's interpret rotateValue (0 to 360) as a progress 0 to 1
                            const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);

                            // Calculate bounded rotation:
                            // Move from 0 (centered) to -spreadAngle (shifts items left) or similar.
                            // Let's allow scrolling through the list.
                            // Total sweep needed to see all items if we start at one end?
                            // If we start centered, we can go +/- spreadAngle/2.

                            // User wants to "stop on the last image".
                            // Let's map scroll to: 0 -> -spreadAngle (shifts items left)
                            const maxRotation = spreadAngle * 0.8; // Don't go all the way, keep last item visible
                            const boundedRotation = -scrollProgress * maxRotation;

                            const currentArcAngle = startAngle + (i * step) + boundedRotation;
                            const arcRad = (currentArcAngle * Math.PI) / 180;

                            const arcPos = {
                                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                                rotation: currentArcAngle + 90,
                                scale: isMobile ? 1.4 : 1.8, // Increased scale for active state
                            };

                            // C. Interpolate (Morph) using visualsProgress so visuals don't jump when overshooting
                            target = {
                                x: lerp(circlePos.x, arcPos.x, visualsProgress),
                                y: lerp(circlePos.y, arcPos.y, visualsProgress),
                                rotation: lerp(circlePos.rotation, arcPos.rotation, visualsProgress),
                                scale: lerp(1, arcPos.scale, visualsProgress),
                                opacity: 1,
                            };
                        }

                        return (
                            <FlipCard
                                key={i}
                                src={src}
                                index={i}
                                total={TOTAL_IMAGES}
                                phase={introPhase} // Pass intro phase for initial animations
                                target={target}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// --- Hero scroll interception: consume initial scroll to drive hero animation ---
function clamp(v: number, a = 0, b = 1) { return Math.max(a, Math.min(b, v)); }

export function useHeroScrollIntercept(containerRef: React.RefObject<HTMLDivElement>, heroProgress: number, setHeroProgress: (v: number|((p:number)=>number)) => void) {
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        let touchStartY = 0;

        const onWheel = (e: WheelEvent) => {
            const rect = el.getBoundingClientRect();
            const heroInView = rect.top <= 0 && rect.bottom > window.innerHeight / 2;
            const heroFullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
            if (!heroInView) return;
            const delta = e.deltaY;
            const factor = 0.0012; // tuned for reasonable sensitivity
            // Scroll down: allow interception until release threshold
            if (delta > 0) {
                if (heroProgress >= RELEASE_THRESHOLD) return; // allow native scroll once beyond threshold
                e.preventDefault();
                setHeroProgress((p: number) => clamp(typeof p === 'number' ? p + delta * factor : (p as any), 0, RELEASE_THRESHOLD));
                return;
            }
            // Scroll up (reverse): only intercept when hero is fully visible and progress > 0
            if (delta < 0) {
                if (!heroFullyVisible) return; // don't rewind unless hero fully in view
                if (heroProgress <= 0) return;
                e.preventDefault();
                setHeroProgress((p: number) => clamp(typeof p === 'number' ? p + delta * factor : (p as any), 0, RELEASE_THRESHOLD));
                return;
            }
        };

        const onTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
        };

        const onTouchMove = (e: TouchEvent) => {
            const rect = el.getBoundingClientRect();
            const heroInView = rect.top <= 0 && rect.bottom > window.innerHeight / 2;
            const heroFullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
            if (!heroInView) return;
            const y = e.touches[0].clientY;
            const delta = touchStartY - y;
            touchStartY = y;
            const factor = 0.0022;
            // Swipe/drag down (delta>0) advances animation
            if (delta > 0) {
                if (heroProgress >= RELEASE_THRESHOLD) return;
                e.preventDefault();
                setHeroProgress((p: number) => clamp(typeof p === 'number' ? p + delta * factor : (p as any), 0, RELEASE_THRESHOLD));
                return;
            }
            // Swipe/drag up (delta<0) — rewind only when hero fully visible
            if (delta < 0) {
                if (!heroFullyVisible) return;
                if (heroProgress <= 0) return;
                e.preventDefault();
                setHeroProgress((p: number) => clamp(typeof p === 'number' ? p + delta * factor : (p as any), 0, RELEASE_THRESHOLD));
                return;
            }
        };

        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: false });

        return () => {
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove);
        };
    }, [containerRef, heroProgress, setHeroProgress]);
}

