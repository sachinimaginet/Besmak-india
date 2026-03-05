"use client";

interface VideoSectionProps {
    content?: {
        videoUrl?: string;
        poster?: string;
        title?: string;
        overlay?: boolean;
    };
}

export default function VideoSection({ content }: VideoSectionProps) {
    const {
        videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-industrial-facility-at-night-11910-large.mp4",
        poster = "",
        title = "",
        overlay = true,
    } = content || {};

    const isYoutube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
    const isVimeo = videoUrl.includes("vimeo.com");

    const getEmbedUrl = (url: string) => {
        if (isYoutube) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = url.match(regExp);
            return match && match[2].length === 11
                ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&loop=1&playlist=${match[2]}`
                : url;
        }
        if (isVimeo) {
            const match = url.match(/vimeo.com\/(\d+)/);
            return match ? `https://player.vimeo.com/video/${match[1]}?autoplay=1&muted=1&loop=1` : url;
        }
        return url;
    };

    return (
        <section className="relative w-full h-screen overflow-hidden bg-black">
            {overlay && (
                <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
            )}

            {isYoutube || isVimeo ? (
                <iframe
                    src={getEmbedUrl(videoUrl)}
                    className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                />
            ) : (
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={poster}
                    className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
                >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}

            {title && (
                <div className="relative z-20 flex items-center justify-center h-full text-center px-4">
                    <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tight animate-fade-in-up">
                        {title}
                    </h2>
                </div>
            )}
        </section>
    );
}
