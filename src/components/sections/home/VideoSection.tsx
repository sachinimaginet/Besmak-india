"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface VideoData {
    url: string;
    title?: string;
    poster?: string;
}

interface VideoSectionProps {
    content?: {
        videos?: VideoData[];
        overlay?: boolean;
    };
}

const defaultVideos: VideoData[] = [
    {
        url: "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/Besmak%20Ai%20video.mp4",
        title: "",
    },
    {
        url: "https://cvnvhpmvk12hdosq.public.blob.vercel-storage.com/Besmak%20Banner%20video%20%281%29.mp4",
        title: "",
    }
];

export default function VideoSection({ content }: VideoSectionProps) {
    const {
        videos = defaultVideos,
        overlay = true,
    } = content || {};

    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const currentIndexRef = useRef(currentIndex);

    useEffect(() => {
        currentIndexRef.current = currentIndex;
    }, [currentIndex]);

    // Handle video progress
    const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>, index: number) => {
        if (index === currentIndexRef.current) {
            const video = e.currentTarget;
            if (video.duration) {
                const currentProgress = (video.currentTime / video.duration) * 100;
                setProgress(currentProgress);
            }
        }
    };

    // Auto-advance logic
    const handleVideoEnd = (index: number) => {
        if (index === currentIndexRef.current) {
            nextVideo();
        }
    };

    const nextVideo = () => {
        setProgress(0);
        setCurrentIndex((prev) => (prev + 1) % videos.length);
    };

    const prevVideo = () => {
        setProgress(0);
        setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
    };



    const currentVideo = videos[currentIndex];

    return (
        <section className="relative w-full h-auto lg:h-[90vh] overflow-hidden bg-black mt-20">
            {/* Background Video Layer */}
            <AnimatePresence>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    {overlay && (
                        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
                    )}

                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        onTimeUpdate={(e) => handleTimeUpdate(e, currentIndex)}
                        onEnded={() => handleVideoEnd(currentIndex)}
                        poster={currentVideo.poster}
                        className="w-full h-full object-cover"
                    >
                        <source src={currentVideo.url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </motion.div>
            </AnimatePresence>

            {/* Content Overlay */}
            <div className="relative z-20 flex items-center justify-center h-full text-center px-4 pointer-events-none">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        {currentVideo.title && (
                            <h2 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-2xl">
                                {currentVideo.title}
                            </h2>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 flex justify-between px-6 md:px-12 pointer-events-none">
                <button
                    onClick={prevVideo}
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all pointer-events-auto group backdrop-blur-sm"
                    aria-label="Previous Video"
                >
                    <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
                </button>
                <button
                    onClick={nextVideo}
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all pointer-events-auto group backdrop-blur-sm"
                    aria-label="Next Video"
                >
                    <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Progress Indicators Container */}
            <div className="absolute bottom-10 inset-x-0 z-30 px-6 md:px-12">
                <div className="max-w-7xl mx-auto flex gap-3">
                    {videos.map((_, index) => (
                        <div
                            key={index}
                            className="h-1 bg-white/20 rounded-full flex-1 overflow-hidden cursor-pointer group"
                            onClick={() => {
                                setProgress(0);
                                setCurrentIndex(index);
                            }}
                        >
                            <div
                                className="h-full bg-white transition-all duration-100 ease-linear"
                                style={{
                                    width: index === currentIndex ? `${progress}%` : index < currentIndex ? "100%" : "0%",
                                    opacity: index === currentIndex ? 1 : 0.4
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Information Overlay (Optional) */}
            <div className="absolute bottom-20 left-6 md:left-12 z-30 pointer-events-none">
                <span className="text-white/50 text-sm font-medium tracking-widest ">
                    0{currentIndex + 1} / 0{videos.length}
                </span>
            </div>
        </section>
    );
}
